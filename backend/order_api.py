"""
FastAPI service providing mock order data for development and testing
Mirrors basic conventions from pivot_api.py for consistency
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import string
import os
import json
import logging
from dotenv import load_dotenv


# Load environment variables
load_dotenv()


# Configure logging (aligned with pivot_api.py)
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
log_format = os.getenv(
    "LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logging.basicConfig(level=getattr(logging, log_level), format=log_format)
logger = logging.getLogger(__name__)


# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))  # different default port from pivot_api
RELOAD = os.getenv("RELOAD", "false").lower() == "true"


# CORS configuration (aligned with pivot_api.py)
# Default allow localhost Storybook and 127.0.0.1:8126; override via CORS_ORIGINS env if needed
CORS_ORIGINS = json.loads(
    os.getenv(
        "CORS_ORIGINS",
        "[\"http://localhost:6006\",\"http://127.0.0.1:8126\",\"http://localhost:8126\"]",
    )
)
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
CORS_ALLOW_METHODS = json.loads(os.getenv("CORS_ALLOW_METHODS", "[\"*\"]"))
CORS_ALLOW_HEADERS = json.loads(os.getenv("CORS_ALLOW_HEADERS", "[\"*\"]"))


# Mock data configuration
ORDER_COUNT = int(os.getenv("ORDER_COUNT", "120"))
RANDOM_SEED = int(os.getenv("ORDER_RANDOM_SEED", "42"))


class OrderItem(BaseModel):
    sku: str = Field(..., description="Stock keeping unit")
    name: str
    quantity: int = Field(..., ge=1)
    unitPrice: float = Field(..., ge=0)
    subtotal: float = Field(..., ge=0)


class Order(BaseModel):
    id: str
    orderNumber: str
    customerName: str
    status: str = Field(
        ..., pattern="^(pending|processing|shipped|delivered|cancelled|returned)$"
    )
    currency: str = "USD"
    country: str
    channel: str  # e.g. Web, Mobile, Store, Marketplace
    paymentMethod: str  # e.g. Credit Card, PayPal, COD
    shippingCost: float = Field(..., ge=0)
    discount: float = Field(..., ge=0)
    tax: float = Field(..., ge=0)
    total: float = Field(..., ge=0)
    createdAt: datetime
    updatedAt: datetime
    deliveredAt: Optional[datetime] = None
    isPriority: bool = False
    items: List[OrderItem]


class OrdersResponse(BaseModel):
    data: List[Order]
    total: int
    page: int
    pageSize: int


def _random_string(length: int) -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


def _random_name() -> str:
    first = random.choice(
        [
            "Alice",
            "Bob",
            "Carol",
            "David",
            "Eva",
            "Frank",
            "Grace",
            "Hank",
            "Ivy",
            "Jack",
            "Karen",
            "Leo",
            "Mia",
            "Nina",
            "Oscar",
            "Paul",
            "Quinn",
            "Rose",
            "Sara",
            "Tom",
            "Una",
            "Vera",
            "Wade",
            "Xena",
            "Yuri",
            "Zoe",
        ]
    )
    last = random.choice(
        [
            "Smith",
            "Johnson",
            "Williams",
            "Brown",
            "Jones",
            "Garcia",
            "Miller",
            "Davis",
            "Rodriguez",
            "Martinez",
            "Hernandez",
            "Lopez",
            "Gonzalez",
            "Wilson",
            "Anderson",
        ]
    )
    return f"{first} {last}"


def _random_country() -> str:
    return random.choice(
        [
            "US",
            "GB",
            "DE",
            "FR",
            "CA",
            "AU",
            "JP",
            "KR",
            "CN",
            "IN",
            "BR",
            "MX",
            "ES",
            "IT",
            "NL",
            "SE",
        ]
    )


def _random_channel() -> str:
    return random.choice(["Web", "Mobile", "Store", "Marketplace"])


def _random_payment_method() -> str:
    return random.choice(["Credit Card", "PayPal", "Bank Transfer", "COD"])


def _random_status() -> str:
    # weighted distribution leaning to delivered/shipped
    return random.choices(
        ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
        weights=[8, 14, 24, 38, 8, 8],
        k=1,
    )[0]


def _random_city_cn() -> str:
    return random.choice([
        "上海", "北京", "广州", "深圳", "成都", "杭州", "南京", "苏州", "武汉", "西安",
        "重庆", "天津", "青岛", "厦门", "宁波", "郑州", "长沙", "佛山", "无锡", "东莞",
    ])


def _status_to_cn(status: str) -> str:
    mapping = {
        "pending": "待处理",
        "processing": "处理中",
        "shipped": "已发货",
        "delivered": "已送达",
        "cancelled": "已取消",
        "returned": "已退货",
    }
    return mapping.get(status, status)


def _random_items() -> List[OrderItem]:
    product_names = [
        "Keyboard",
        "Mouse",
        "Headset",
        "Monitor",
        "Webcam",
        "Laptop Stand",
        "USB Hub",
        "Charger",
        "Backpack",
        "Microphone",
    ]
    num_items = random.randint(1, 5)
    items: List[OrderItem] = []
    for _ in range(num_items):
        name = random.choice(product_names)
        quantity = random.randint(1, 4)
        unit_price = round(random.uniform(9.9, 399.0), 2)
        subtotal = round(quantity * unit_price, 2)
        items.append(
            OrderItem(
                sku=_random_string(8),
                name=name,
                quantity=quantity,
                unitPrice=unit_price,
                subtotal=subtotal,
            )
        )
    return items


def _generate_order(order_index: int, base_time: datetime) -> Order:
    items = _random_items()
    items_total = round(sum(i.subtotal for i in items), 2)
    shipping = round(random.uniform(0, 25), 2)
    discount = round(random.uniform(0, items_total * 0.15), 2)
    taxable_amount = max(items_total + shipping - discount, 0)
    tax = round(taxable_amount * random.uniform(0.05, 0.2), 2)
    total = round(taxable_amount + tax, 2)

    created_at = base_time - timedelta(days=random.randint(0, 90), hours=random.randint(0, 23))
    updated_at = created_at + timedelta(hours=random.randint(1, 72))
    status = _random_status()
    delivered_at: Optional[datetime] = None
    if status in {"shipped", "delivered"}:
        delivered_at = updated_at + timedelta(days=random.randint(1, 10))
        if status == "shipped":
            # not yet delivered in some cases
            delivered_at = delivered_at if random.random() > 0.5 else None

    return Order(
        id=_random_string(12),
        orderNumber=f"ORD-{created_at.strftime('%y%m')}-{order_index:05d}",
        customerName=_random_name(),
        status=status,
        currency="USD",
        country=_random_country(),
        channel=_random_channel(),
        paymentMethod=_random_payment_method(),
        shippingCost=shipping,
        discount=discount,
        tax=tax,
        total=total,
        createdAt=created_at,
        updatedAt=updated_at,
        deliveredAt=delivered_at,
        isPriority=bool(random.getrandbits(1) and random.random() > 0.7),
        items=items,
    )


def generate_mock_orders(count: int) -> List[Order]:
    random.seed(RANDOM_SEED)
    base_time = datetime.utcnow()
    return [_generate_order(i + 1, base_time) for i in range(count)]


# In-memory data store
ORDERS: List[Order] = generate_mock_orders(ORDER_COUNT)


def _filter_orders(
    orders: List[Order],
    status: Optional[str],
    customer: Optional[str],
    country: Optional[str],
    date_from: Optional[datetime],
    date_to: Optional[datetime],
    min_total: Optional[float],
    max_total: Optional[float],
) -> List[Order]:
    result: List[Order] = []
    for o in orders:
        if status and o.status != status:
            continue
        if customer and customer.lower() not in o.customerName.lower():
            continue
        if country and o.country != country:
            continue
        if date_from and o.createdAt < date_from:
            continue
        if date_to and o.createdAt > date_to:
            continue
        if min_total is not None and o.total < min_total:
            continue
        if max_total is not None and o.total > max_total:
            continue
        result.append(o)
    return result


def _sort_orders(orders: List[Order], sort_by: str, sort_dir: str) -> List[Order]:
    key_map = {
        "createdAt": lambda o: o.createdAt,
        "updatedAt": lambda o: o.updatedAt,
        "total": lambda o: o.total,
        "customerName": lambda o: o.customerName.lower(),
        "status": lambda o: o.status,
        "orderNumber": lambda o: o.orderNumber,
    }
    key_fn = key_map.get(sort_by, key_map["createdAt"])
    reverse = sort_dir.lower() == "desc"
    return sorted(orders, key=key_fn, reverse=reverse)


# FastAPI app
app = FastAPI(
    title="Orders Mock API",
    description="Provides mock order data with simple filtering and pagination",
    version="1.0.0",
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:6006",
        "http://127.0.0.1:6006",
    ],
    allow_credentials=CORS_ALLOW_CREDENTIALS,
    allow_methods=CORS_ALLOW_METHODS,
    allow_headers=CORS_ALLOW_HEADERS,
)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "orders": len(ORDERS),
        "timestamp": int(datetime.utcnow().timestamp()),
    }


@app.get("/orders", response_model=OrdersResponse)
async def list_orders(
    page: int = 1,
    pageSize: int = 20,
    status: Optional[str] = None,
    customer: Optional[str] = None,
    country: Optional[str] = None,
    dateFrom: Optional[str] = None,
    dateTo: Optional[str] = None,
    minTotal: Optional[float] = None,
    maxTotal: Optional[float] = None,
    sortBy: str = "createdAt",
    sortDir: str = "desc",
):
    try:
        df = datetime.fromisoformat(dateFrom) if dateFrom else None
        dt = datetime.fromisoformat(dateTo) if dateTo else None
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, expected ISO8601")

    filtered = _filter_orders(
        ORDERS, status, customer, country, df, dt, minTotal, maxTotal
    )
    sorted_list = _sort_orders(filtered, sortBy, sortDir)

    # pagination
    safe_page = max(page, 1)
    safe_size = min(max(pageSize, 1), 200)
    start = (safe_page - 1) * safe_size
    end = start + safe_size
    data = sorted_list[start:end]

    return OrdersResponse(data=data, total=len(filtered), page=safe_page, pageSize=safe_size)


@app.get("/orders/sample", response_model=List[List[Any]])
async def sample_orders(limit: int = 10):
    limit = max(1, min(limit, 50))
    orders = _sort_orders(ORDERS, "createdAt", "desc")[:limit]

    header = [
        "订单号",
        "客户",
        "产品",
        "数量",
        "单价",
        "金额",
        "城市",
        "日期",
        "状态",
    ]

    matrix: List[List[Any]] = [header]

    for idx, o in enumerate(orders):
        item = o.items[0] if o.items else None
        quantity = item.quantity if item else 1
        unit_price = item.unitPrice if item else 0.0
        amount = round(quantity * unit_price, 2)
        product_name = f"产品{chr(65 + (idx % 26))}" if not item else item.name

        row: List[Any] = [
            o.orderNumber,
            o.customerName,
            product_name,
            quantity,
            unit_price,
            amount,
            _random_city_cn(),
            o.createdAt.strftime("%Y-%m-%d"),
            _status_to_cn(o.status),
        ]
        matrix.append(row)

    return matrix


@app.get("/orders/stats")
async def orders_stats():
    by_status: Dict[str, int] = {}
    total_revenue = 0.0
    for o in ORDERS:
        by_status[o.status] = by_status.get(o.status, 0) + 1
        total_revenue += o.total

    return {
        "count": len(ORDERS),
        "byStatus": by_status,
        "totalRevenue": round(total_revenue, 2),
        "currency": "USD",
    }


@app.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    for o in ORDERS:
        if o.id == order_id:
            return o
    raise HTTPException(status_code=404, detail="Order not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=HOST,
        port=PORT,
        reload=RELOAD,
        log_level=log_level.lower(),
    )


