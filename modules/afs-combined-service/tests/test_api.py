from fastapi.testclient import TestClient

from ..app import app

client = TestClient(app)

mock_user_reg_detail = {
    "password": "mock_password",
    "first_name": "Mock",
    "last_name": "User",
    "username": "mock.user",
    "role": "ADMIN"
}

def test_register_user():
    response = client.post("/api/v1/auth/signup", json=mock_user_reg_detail)
    assert response.status_code == 200
    assert response.json() == {"message": "User registered successfully"}