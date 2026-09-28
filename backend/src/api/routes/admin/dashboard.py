from fastapi import APIRouter, Depends

from src.api.schemas.admin import DashboardStats
from src.api.services.admin import AdminService
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    service: AdminService = Depends(get_service),
    current_admin: CurrentAdmin = None,
):
    return await service.get_dashboard_stats()
