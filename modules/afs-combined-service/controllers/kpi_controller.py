from fastapi import APIRouter
from dtypes.kpi_dtypes import (
    CountResponse, RevenueRequest, RevenueResponse,
    NewClientsRequest, NewClientsResponse,
    MonthlySalesRequest, MonthlySalesResponse
)
from services.kpi_service import (
    get_project_count, get_sr_count,
    get_revenue_by_month_year, get_new_clients_count,
    get_monthly_sales_data
)

router = APIRouter(prefix="/api/v1/kpi", tags=["KPI"])

@router.get("/projects/{owner}/count", response_model=CountResponse)
async def project_count(owner: str):
    return CountResponse(count=get_project_count(owner))

@router.get("/srs/{owner}/count", response_model=CountResponse)
async def sr_count(owner: str):
    return CountResponse(count=get_sr_count(owner))

@router.post("/revenue/{owner}", response_model=RevenueResponse)
async def revenue(owner: str, req: RevenueRequest):
    revenue = get_revenue_by_month_year(req.year, req.month, owner)
    return RevenueResponse(revenue=revenue)

# Send empty req body like {} you dumb fuck to get default days value
@router.post("/clients/{owner}/new", response_model=NewClientsResponse)
async def new_clients(owner: str, req: NewClientsRequest):
    count = get_new_clients_count(req.days, owner)
    return NewClientsResponse(count=count)

@router.post("/sales/{owner}/monthly", response_model=MonthlySalesResponse)
async def monthly_sales(owner: str, req: MonthlySalesRequest):
    sales = get_monthly_sales_data(
        owner,
        start_year=req.start_year,
        start_month=req.start_month,
        end_year=req.end_year,
        end_month=req.end_month
    )
    return MonthlySalesResponse(sales=sales)
