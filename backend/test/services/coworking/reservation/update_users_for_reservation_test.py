import pytest
from unittest.mock import create_autospec, MagicMock
from sqlalchemy.orm import Session
from backend.services.coworking import ReservationService
from backend.entities.coworking import ReservationEntity, reservation_user_table
from backend.entities import UserEntity
from backend.models.coworking import Reservation
from .....services.exceptions import ResourceNotFoundException
from backend.services.permission import PermissionService
from backend.services.coworking.seat import SeatService
from backend.services.coworking.policy import PolicyService
from backend.services.coworking.operating_hours import OperatingHoursService


@pytest.fixture
def reservation_svc():
    mock_session = create_autospec(Session)
    mock_permission_svc = create_autospec(PermissionService)
    mock_policy_svc = create_autospec(PolicyService)
    mock_operating_hours_svc = create_autospec(OperatingHoursService)
    mock_seat_svc = create_autospec(SeatService)

    return ReservationService(
        session=mock_session,
        permission_svc=mock_permission_svc,
        policy_svc=mock_policy_svc,
        operating_hours_svc=mock_operating_hours_svc,
        seats_svc=mock_seat_svc,
    )


def test_update_users_for_reservation_success():
    """Test successfully updating users for a reservation."""
    # Arrange
    mock_session = create_autospec(Session)
    reservation_svc = ReservationService(session=mock_session)

    reservation_id = 1
    user_ids = [101, 102]
    reservation_entity = MagicMock(spec=ReservationEntity)
    reservation_entity.id = reservation_id
    reservation_model = MagicMock(spec=Reservation)
    reservation_model.id = reservation_id

    new_users = [
        MagicMock(spec=UserEntity, id=user_ids[0]),
        MagicMock(spec=UserEntity, id=user_ids[1]),
    ]

    mock_session.get.return_value = reservation_entity
    mock_session.query.return_value.filter.return_value.all.return_value = new_users
    reservation_entity.to_model.return_value = reservation_model

    # Act
    result = reservation_svc.update_users_for_reservation(reservation_id, user_ids)

    # Assert
    assert result.id == reservation_id


def test_update_users_for_reservation_empty_user_list():
    """Test updating reservation with an empty user list."""
    # Arrange
    mock_session = create_autospec(Session)
    reservation_svc = ReservationService(session=mock_session)

    reservation_id = 1
    user_ids = []  # Empty user list
    reservation_entity = MagicMock(spec=ReservationEntity)
    reservation_entity.id = reservation_id
    reservation_model = MagicMock(spec=Reservation)
    reservation_model.id = reservation_id

    mock_session.get.return_value = reservation_entity
    reservation_entity.to_model.return_value = reservation_model

    # Act
    result = reservation_svc.update_users_for_reservation(reservation_id, user_ids)

    # Assert
    assert result.id == reservation_id


def test_update_users_for_reservation_reservation_not_found(
    reservation_svc: ReservationService,
):
    """Test when reservation is not found."""
    # Arrange
    mock_session = create_autospec(Session)
    reservation_svc._session = mock_session

    reservation_id = 999  # Non-existent reservation
    user_ids = [101]
    mock_session.get.return_value = None

    # Act & Assert
    with pytest.raises(ResourceNotFoundException):
        reservation_svc.update_users_for_reservation(reservation_id, user_ids)


def test_update_users_for_reservation_user_not_found(
    reservation_svc: ReservationService,
):
    """Test when one or more users are not found."""
    # Arrange
    mock_session = create_autospec(Session)
    reservation_svc._session = mock_session

    reservation_id = 1
    user_ids = [101, 999]  # User ID 999 does not exist
    reservation_entity = MagicMock(spec=ReservationEntity)
    reservation_entity.id = reservation_id

    new_users = [MagicMock(spec=UserEntity, id=user_ids[0])]

    mock_session.get.return_value = reservation_entity
    mock_session.query.return_value.filter.return_value.all.return_value = new_users

    # Act & Assert
    with pytest.raises(ResourceNotFoundException):
        reservation_svc.update_users_for_reservation(reservation_id, user_ids)
