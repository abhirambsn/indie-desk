from pydantic import BaseModel, Field, field_validator
from typing import List


class CountResponse(BaseModel):
    count: int = Field(..., description="The total count result")


class RevenueRequest(BaseModel):
    year: int = Field(..., ge=1, description="The year for which revenue is requested")
    month: int = Field(..., ge=1, le=12, description="The month (1-12) for which revenue is requested")

    @field_validator('month')
    @classmethod
    def check_month(cls, v):
        if not 1 <= v <= 12:
            raise ValueError('month must be between 1 and 12')
        return v


class RevenueResponse(BaseModel):
    revenue: int = Field(..., description="Total revenue for the given month and year")


class NewClientsRequest(BaseModel):
    days: int = Field(30, ge=1, description="Number of days to look back for new clients")


class NewClientsResponse(BaseModel):
    count: int = Field(..., description="Number of new clients in the given timeframe")


class MonthlySalesRequest(BaseModel):
    start_year: int = Field(..., ge=1, description="Start year for sales data range")
    start_month: int = Field(..., ge=1, le=12, description="Start month (1-12) for sales data range")
    end_year: int = Field(..., ge=1, description="End year for sales data range")
    end_month: int = Field(..., ge=1, le=12, description="End month (1-12) for sales data range")





class MonthlySalesResponse(BaseModel):
    sales: List[int] = Field(..., description="List of total revenues for each month in the range")
