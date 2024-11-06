# Group Reservation for Meeting Rooms

Team members: Boyang Mu, Hengyi Liu

## Overview

This project aims to imporve the reservation system on CSXL site and make the study room resource more utilized. The reservation creator should be able to add people when creating a reservation. Only a group of people with more than half of the room capacity should have the permission to reserve a room. The creator also has the ability to remove people from existing reservations. All meeting particpants should be able to check in before the meeting time.

## Key Personas

UNC students: need to have precedence in reserving meeting rooms for a large group of people versus a single person.
CSXL Ambassador: need to be able to view all room reservations and their members to manage and assess the efficiency of the reservation system.

## User Stories

As Henry the student, I want to reserve a room for my large group of people when the room is only used by some single person, so that my group can collaborate together in that room.  
As Henry the student, I want to be able to reserve an empty room immediately when nobody is using that room, so that I can work in that room.
As George the ambassador, I want to be able to view all the room reservations, so that I can better manage the reservation system.
As George the ambassador, I want to be able to view the members of a room reservation, so that I can assess the efficiency of the reservation system.

## Wireframes/Mockups

See the [Figma high-fidelity prototype](https://www.figma.com/design/81aQMhGF3gGsVoBnLfBYDw/COMP-423-Final-Project-Mockup?node-id=11-1833&node-type=canvas&t=wTfkLh3zZzLi8Oty-0)

Step for adding members to a room reservation:  
![add members](/docs/images/add-people.png)
Step for confirming reservations with members shown:  
![confirm reservations](/docs/images/confirm-reservation.png)
Step for showing existing reservations with members:  
![existing reservations](/docs/images/edit-reservations.png)

## Technical Implementation Opportunities and Plannings

1. What specific areas of the existing code base will you directly depend upon, extend, or integrate with?  
   When implementing group reservation for meeting rooms, we will directly depend upon both the frontend (frontend/src/app/coworking/room-reservation) directory and the backend (backend/api/coworking/reservation.py) code.

2. What planned page components and widgets do you anticipate needing in your feature’s frontend?  
   We will modify the reservation form to allow adding/removing people by adding a searchable input for adding fellow occupants. A dynamic validation that updates according to room size will be implemented. We will also have a real-time conflict indicator that shows a notification if selected users already have reservations in that time slot. A special widget to show all group members within a reservation will be added to XL Ambassador view.

3. What additional models, or changes to existing models, do you foresee needing (if any)?  
   There are no changes needed for the existing models, they already support associating multiple people to a room reservation.

4. Considering your most-frequently used and critical user stories, what API / Routes do you foresee modifying or needing to add?  
   We will modify the reservation creation API to differentiate between future and immediate reservation. It will check that at least ceiling(room size / 2) people are added to the reservation for future reservations. We will add an API to verify if there is a time conflict for added people when creating or editing reservations. An API to modify reservations after it is created will be implemented. This API will keep the same validation rules as creating the reservation. We will also add a check-in API to enable each user to check in before the reservation time.

5. What concerns exist for security and privacy of data? Should the capabilities you are implementing be specific to only certain users or roles? (For example: When Sally Student makes a reservation, only Sally Student or Amy Ambassador should be able to cancel the reservation. Another student, such as Sam Student, should not be able to cancel Sally’s reservation.)  
   We will implement access controls on reservations to ensure that only the people added to the reservation and XL Ambassadors can view reservation details and make modifications. The ability to cancel reservations will be limited to the reservation creator and XL Ambassadors. People will not be allowed to see the complete list of other people’s upcoming reservations. They will only be notified if there is a conflict. Only users added to the reservation will have the capability to check in.
