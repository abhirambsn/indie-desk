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

@router.get("/projects/count", response_model=CountResponse)
async def project_count():
    return CountResponse(count=get_project_count())

@router.get("/srs/count", response_model=CountResponse)
async def sr_count():
    return CountResponse(count=get_sr_count())

@router.post("/revenue", response_model=RevenueResponse)
async def revenue(req: RevenueRequest):
    revenue = get_revenue_by_month_year(req.year, req.month)
    return RevenueResponse(revenue=revenue)

# Send empty req body like {} you dumb fuck to get default days value
@router.post("/clients/new", response_model=NewClientsResponse)
async def new_clients(req: NewClientsRequest):
    count = get_new_clients_count(req.days)
    return NewClientsResponse(count=count)

@router.post("/sales/monthly", response_model=MonthlySalesResponse)
async def monthly_sales(req: MonthlySalesRequest):
    sales = get_monthly_sales_data(
        start_year=req.start_year,
        start_month=req.start_month,
        end_year=req.end_year,
        end_month=req.end_month
    )
    return MonthlySalesResponse(sales=sales)
