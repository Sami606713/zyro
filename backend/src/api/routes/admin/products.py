from typing import List

from fastapi import APIRouter, Depends, Query, UploadFile, File, status
from fastapi.responses import StreamingResponse

from src.api.exceptions import NotFoundException
from src.api.models import ProductImage
from src.api.schemas.admin import (
    ImageUpdate,
    ProductCreate,
    ProductResponse,
    ProductStatusUpdate,
    ProductUpdate,
    ProductVariantResponse,
    VariantCreate,
    VariantUpdate,
)
from src.api.services.admin import AdminService
from src.api.utils.admin import upload_image, validate_image_file, delete_image as cloudinary_delete
from src.api.utils.deps import CurrentAdmin, DBDep

import csv
import io

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/products", response_model=List[ProductResponse])
async def list_products(
    current_admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    category_id: int | None = None,
    is_active: bool | None = None,
    service: AdminService = Depends(get_service),
):
    return await service.list_products(skip, limit, search, category_id, is_active)


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    return await service.create_product(data.model_dump())


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    product = await service.get_product(product_id)
    if not product:
        raise NotFoundException("Product not found")
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    product = await service.update_product(product_id, data.model_dump(exclude_unset=True))
    if not product:
        raise NotFoundException("Product not found")
    return product


@router.put("/products/{product_id}/status", response_model=ProductResponse)
async def update_product_status(
    product_id: int,
    data: ProductStatusUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    product = await service.update_product(product_id, data.model_dump())
    if not product:
        raise NotFoundException("Product not found")
    return product


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    deleted = await service.delete_product(product_id)
    if not deleted:
        raise NotFoundException("Product not found")


@router.post("/products/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED)
async def create_variant(
    product_id: int,
    data: VariantCreate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    return await service.create_variant(product_id, data.model_dump())


@router.put("/variants/{variant_id}", response_model=ProductVariantResponse)
async def update_variant(
    variant_id: int,
    data: VariantUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    variant = await service.update_variant(variant_id, data.model_dump(exclude_unset=True))
    if not variant:
        raise NotFoundException("Variant not found")
    return variant


@router.delete("/variants/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_variant(
    variant_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    deleted = await service.delete_variant(variant_id)
    if not deleted:
        raise NotFoundException("Variant not found")


@router.post("/products/{product_id}/images", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    product_id: int,
    current_admin: CurrentAdmin,
    file: UploadFile = File(...),
    service: AdminService = Depends(get_service),
):
    product = await service.get_product(product_id)
    if not product:
        raise NotFoundException("Product not found")

    validate_image_file(file)
    upload_result = upload_image(file.file)
    image = ProductImage(
        product_id=product_id,
        image_url=upload_result["url"],
        is_primary=len(product.images) == 0,
    )
    service.db.add(image)
    await service.db.commit()
    await service.db.refresh(image)
    return await service.get_product(product_id)


@router.put("/images/{image_id}", response_model=ProductResponse)
async def update_image(
    image_id: int,
    data: ImageUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    image = await service.update_image(image_id, data.model_dump(exclude_unset=True))
    if not image:
        raise NotFoundException("Image not found")
    return image


@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    image = await service.db.get(ProductImage, image_id)
    if not image:
        raise NotFoundException("Image not found")
    if image.public_id:
        cloudinary_delete(image.public_id)
    deleted = await service.delete_image(image_id)
    if not deleted:
        raise NotFoundException("Image not found")


@router.post("/products/bulk", status_code=status.HTTP_201_CREATED)
async def bulk_create_products(
    products: List[ProductCreate],
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    created = []
    for product_data in products:
        product = await service.create_product(product_data.model_dump())
        created.append(product)
    return {"created": len(created), "products": created}


@router.get("/products/export")
async def export_products_csv(
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    products = await service.list_products(0, 1000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Slug", "Price", "Category", "Active", "Created"])

    for product in products:
        writer.writerow([
            product.id,
            product.name,
            product.slug,
            product.base_price,
            product.category.name if product.category else "",
            product.is_active,
            product.created_at,
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products.csv"},
    )
