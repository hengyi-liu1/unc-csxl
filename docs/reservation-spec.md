# Group Reservation Feature Specification

## Authors

- [Hengyi Liu](https://github.com/liuhenry2003)
- [Boyang Mu](https://github.com/BoyangMu)

## Overview

This document outlines the enhancements to the CS Experience Labs reservation system designed to optimize the use of seven available meeting rooms, ranging from 2-seaters for pair programming to 7-seaters for larger groups. The update introduces a requirement for future reservations made more than 30 minutes in advance to include at least half of the room’s capacity in occupants, aiming to prevent underutilization of space. Immediate reservations can be made without additional occupants. This feature enhancement includes backend and frontend updates to support adding multiple users to a reservation, validate group sizes based on room capacity, and improve visibility of reservations for all involved parties, including XL Ambassadors.

## System Architecture

### Modified Models

- **ReservationEntity**: This entity now includes a `host_id` attribute, which is a foreign key that links to the `User` table. This association is crucial for identifying the user responsible for creating a reservation.
- **RoomEntity**: A new `capacity` attribute has been added to manage the maximum number of participants for each room, crucial for enforcing a efficient usage of the room.

### API Enhancements

We have introduced changes and enhancements to the API to support new functionalities:

- Existing endpoints have been updated to handle `host_id` and `capacity`, ensuring the frontend is able to retrieve information about the current user and the room capacity.

## Database Schema Changes

Detailed changes to the database include:

- **Reservation Table**: Addition of the `host_id` column, which requires a corresponding update in the database schema to ensure referential integrity with the `User` table.
- **Room Table**: Addition of the `capacity` column to ensure that group reservations do not exceed the designated room capacity.

Key database design decisions include the incorporation of host_id in the ReservationEntity to track who initiates a reservation and a capacity attribute in the RoomEntity to enforce minimum group sizes for bookings. This structure ensures that bookings adhere to availability and capacity constraints.

## Design Rationale

### Technical Decision

- **Integrating Multi-User Handling in Existing Systems**: We chose to improve our current backend logic to handle multiple users in a reservation rather than building a new system for group management. This choice makes better use of our existing database structure, ensuring a more consistent approach to managing all types of reservations. By using our current relational database setup, we can effectively handle user relationships and room capacities without adding extra complexity to our system.

### User Experience Decision

- **Direct Group Addition in Reservation Form**: We decided to let users add group members directly in the reservation form rather than requiring them to pre-set groups in a separate interface. This approach saves time and simplifies the steps needed to make a reservation. It enhances the overall user experience by reducing the complexity and potential for errors during data entry, making the reservation system more intuitive and user-friendly.

- **Real-Time Validation Over Post-Submission Checks**: We chose to implement immediate validation of group size directly in the reservation form instead of using a post-submission validation process. This method provides instant feedback to users, enabling them to correct their entries before completing the reservation. This immediate feedback ensures users are aware if they need to add more participants to meet the room's minimum capacity, which improve user experience by making the reservation process more efficient.

## Development Guide

### Environment Setup

New developers should start by setting up their local development environment as follows:

1. Clone the repository.
2. Install required dependencies using `pip` for Python backend and `npm` for JavaScript frontend.
3. Set up a local database using the provided schema.

### Key Components

Developers should familiarize themselves with the following key components:

- `models/reservation.py` and `models/room.py`: These files define the data models for reservations and rooms. Understanding these will help in managing data interactions.
- `services/reservation.py`: This script contains all business logic related to reservations, including validation, creation, and modification of reservations.
- `entities/reservation_entity.py` and `entities/room_entity.py`: These entity files link the database tables directly to the data models, providing a bridge between the database and the application logic.
- `frontend/src/app/coworking/widgets`: Includes Angular components that are used to build the interactive parts of the reservation system UI, such as forms for reservation entry and display components for reservation details.

### Testing

- Comprehensive tests are available in `/workspace/backend/test/services/coworking/reservation`. These tests cover various scenarios including group size limitations, room capacity enforcement, and proper handling of reservation time conflicts.

## Implementation Screenshots

### Adding a Group Reservation

![Adding a Group Reservation](/docs/images/add-group-reservation.png)
*This screenshot illustrates the interface for adding a new group reservation, showing the form fields for date, time, room selection, and participant addition.*

### Viewing Group Reservations

![Viewing Group Reservations](/docs/images/view-group-reservations.png)
*This screenshot displays the overview of existing reservations where users can see detailed views or modify their bookings.*

## Conclusion

This detailed specification aims to provide a guide for understanding the group reservation feature. It includes key components for development and extends guidance on how to further develop or debug the feature.
