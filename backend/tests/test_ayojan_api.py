"""Backend API tests for Ayojan Wale."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://festive-vendor-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# --- Reference data ---
def test_categories(s):
    r = s.get(f"{API}/categories")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) > 0
    assert "slug" in data[0] and "name" in data[0]


def test_event_types(s):
    r = s.get(f"{API}/event-types")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) > 0


def test_ideas(s):
    r = s.get(f"{API}/ideas")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# --- Vendors ---
def test_vendors_all(s):
    r = s.get(f"{API}/vendors")
    assert r.status_code == 200
    vendors = r.json()
    assert isinstance(vendors, list) and len(vendors) > 0
    v0 = vendors[0]
    for k in ("id", "name", "category_slug", "city"):
        assert k in v0


def test_vendors_filter_category(s):
    # get a category first
    cats = s.get(f"{API}/categories").json()
    slug = cats[0]["slug"]
    r = s.get(f"{API}/vendors", params={"category": slug})
    assert r.status_code == 200
    for v in r.json():
        assert v["category_slug"] == slug


def test_vendors_filter_city(s):
    cities = s.get(f"{API}/vendors/cities").json()
    assert isinstance(cities, list) and len(cities) > 0
    city = cities[0]
    r = s.get(f"{API}/vendors", params={"city": city})
    assert r.status_code == 200
    for v in r.json():
        assert v["city"] == city


def test_vendors_search(s):
    all_v = s.get(f"{API}/vendors").json()
    name_part = all_v[0]["name"][:3]
    r = s.get(f"{API}/vendors", params={"q": name_part})
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_vendor_detail(s):
    all_v = s.get(f"{API}/vendors").json()
    vid = all_v[0]["id"]
    r = s.get(f"{API}/vendors/{vid}")
    assert r.status_code == 200
    assert r.json()["id"] == vid


def test_vendor_detail_404(s):
    r = s.get(f"{API}/vendors/nonexistent-id-xyz")
    assert r.status_code == 404


# --- Events (Plan wizard) ---
def test_create_event_and_fetch(s):
    payload = {
        "name": "TEST_Wedding",
        "event_type": "wedding",
        "date": "2026-02-14",
        "city": "Delhi",
        "guest_count": "200",
        "budget": "500000",
        "requirements": [
            {"category_slug": "photography", "category_name": "Photography", "notes": ""},
            {"category_slug": "decoration", "category_name": "Decoration", "notes": ""},
        ],
    }
    r = s.post(f"{API}/events", json=payload)
    assert r.status_code == 200, r.text
    ev = r.json()
    assert ev["name"] == payload["name"]
    assert "id" in ev
    # verify persistence
    g = s.get(f"{API}/events/{ev['id']}")
    assert g.status_code == 200
    assert g.json()["event_type"] == "wedding"
    assert len(g.json()["requirements"]) == 2


# --- Leads (Vendor enquiry) ---
def test_create_lead(s):
    all_v = s.get(f"{API}/vendors").json()
    vid = all_v[0]["id"]
    payload = {"vendor_id": vid, "name": "TEST_User", "phone": "9999999999", "message": "hi"}
    r = s.post(f"{API}/leads", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body.get("ok") is True
    assert "id" in body
