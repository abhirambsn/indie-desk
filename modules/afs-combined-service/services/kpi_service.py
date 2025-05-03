from models.database_model import MongoDB
from datetime import datetime, timedelta

def get_project_count() -> int:
    try:
        projects = MongoDB.find_many(db_name="iddb", collection_name="project", query={})
        return len(projects)
    except Exception as e:
        print("❌ Error counting projects:", e)
        return 0

def get_sr_count() -> int:
    try:
        srs = MongoDB.find_many(db_name="iddb", collection_name="supportticket", query={})
        return len(srs)
    except Exception as e:
        print("❌ Error counting service requests:", e)
        return 0
    
def get_revenue_by_month_year(year: int, month: int) -> int:
    try:
        query = {
            "status": "PAID",
            "$expr": {
                "$and": [
                    { "$eq": [{ "$year": "$paymentInfo.date" }, year] },
                    { "$eq": [{ "$month": "$paymentInfo.date" }, month] }
                ]
            }
        }

        # Fetch matching invoices
        invoices = MongoDB.find_many("iddb", "invoice", query)

        # Sum up the paid amounts
        total_revenue = sum(
            inv["paymentInfo"]["amount"]["amount"]
            for inv in invoices
            if "paymentInfo" in inv
               and "amount" in inv["paymentInfo"]
               and "amount" in inv["paymentInfo"]["amount"]
        )

        print(f"📈 Total revenue for {year}-{month:02d}: {total_revenue}")
        return total_revenue

    except Exception as e:
        print("❌ Error fetching revenue:", e)
        return 0

def get_revenue_by_month_year(year: int, month: int) -> int:
    try:
        query = {
            "status": "PAID",
            "$expr": {
                "$and": [
                    { "$eq": [{ "$year": "$paymentInfo.date" }, year] },
                    { "$eq": [{ "$month": "$paymentInfo.date" }, month] }
                ]
            }
        }

        # Fetch matching invoices
        invoices = MongoDB.find_many("iddb", "invoices", query)

        # Sum up the paid amounts
        total_revenue = sum(
            inv["paymentInfo"]["amount"]["amount"]
            for inv in invoices
            if "paymentInfo" in inv
               and "amount" in inv["paymentInfo"]
               and "amount" in inv["paymentInfo"]["amount"]
        )

        print(f"📈 Total revenue for {year}-{month:02d}: {total_revenue}")
        return total_revenue

    except Exception as e:
        print("❌ Error fetching revenue:", e)
        return 0
    
def get_new_clients_count(days: int = 30) -> int:
    """
    Returns the number of clients created in the last `days` days.
    Defaults to 30 days.
    """
    try:
        # Calculate cutoff datetime (UTC)
        cutoff = datetime.now() - timedelta(days=days)

        # Query for documents whose createdAt is >= cutoff
        query = { "createdAt": { "$gte": cutoff } }

        # Use count_documents for an efficient count
        count = MongoDB.get_collection("iddb", "client") \
                       .count_documents(query)
        return count

    except Exception as e:
        print("❌ Error counting new clients:", e)
        return 0
    
def get_monthly_sales_data(
    start_year: int,
    start_month: int,
    end_year: int,
    end_month: int
) -> list[int]:
    """
    Returns a list of total revenues for each month from
    (start_year, start_month) through (end_year, end_month), in chronological order.
    """
    sales: list[int] = []
    y, m = start_year, start_month

    # iterate month-by-month
    while (y < end_year) or (y == end_year and m <= end_month):
        revenue = get_revenue_by_month_year(y, m)
        sales.append(revenue)

        # increment month
        if m == 12:
            m = 1
            y += 1
        else:
            m += 1

    return sales

