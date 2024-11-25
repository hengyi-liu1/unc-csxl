**User Story 1 \- Technical Specification Documentation**  
By Hengyi Liu and Boyang Mu

User story 1: As Sally Student, I want to add members to a coworking room reservation, so that my team can collaborate together.

1. Descriptions and sample data representations of new or modified model representation(s) and API routes supporting your feature’s stories

   New API routes:

   @api.put("/reservation/{reservation\_id}/update-users", tags=\["Coworking"\])

   def update\_reservation\_users(

       reservation\_id: int,

       request: UpdateUsersRequest,

       reservation\_svc: ReservationService \= Depends(),

   ):

       """Update the list of users for a reservation."""

       print(

           f"API handler called for reservation\_id: {reservation\_id}, user\_ids: {request.user\_ids}"

       )

       return reservation\_svc.update\_users\_for\_reservation(

           reservation\_id, request.user\_ids

       )

   Description: API route for updating the users of a reservation.

   Sample data representation:

   Input: 	reservation\_id: 1 (The id of a reservation)

   	request: \[1, 2, 3\] (The user ids of all users in that reservation)

2. Description of underlying database/entity-level representation decisions

   We used the original database/entity-level representations.

   Multiple members of a group reservation are stored in the ReservationEntity.users attribute. Each user is stored as a UserEntity, which contains attributes: {

   id: Integer,

   pid: Integer,

   onyen: String(32),

   email: String(32),

   first\_name: String(64),

   last\_name: String(64),

   pronouns: String(32),

   github: String(32),

   github\_id: Integer,

   github\_avatar: String(),

   accepted\_community\_agreement: Boolean,

   bio: String(),

   linkedin: String(),

   website: String()

   }

3. At least one technical and one user experience design choice your team weighed the trade-offs with justification for the decision (we chose X over Y, because…)

   1 technical design choice: we chose to only pass user ids from frontend to backend to represent users over passing the entire User type, because it’s more simple and requires less space in the payload.

   1 user experience design choice: we chose to display matched users real time during user search over only responding after user clicked search, because it is more user friendly and easy to use.

4. Development concerns: How does a new developer get started on your feature? Brief guide/tour of the files and concerns they need to understand to get up-to-speed.

   A new developer can get started on this feature by going through the files:

   Frontend:

1. new-reservation-page.html: The page for drafting a new reservation

   Inside that page is a room-reservation-table

2. room-reservation-table.widget.html: The table for selecting the room and time for the reservation draft.

   After clicking the reserve button below the table, the function draftReservation() in room-reservation-table.widget.ts is called

3. room-reservation-table.widget.ts: Inside the draftReservation() function, it collects the reservation information and passes it to the function draftReservation() in the reservationTableService.ts, which drafts the reservation and stores it in the backend, then navigates to the confirm reservation page.  
4. reservationTableService.ts: The draftReservation() here takes the information and constructs a reservationRequest, and then passes it to the function makeDraftReservation() in the same file, which contacts the backend for storing this reservation.

   Backend:

1. /backend/api/coworking/reservation.py: it got the request from frontend at: @api.post("/reservation", tags=\["Coworking"\]). Then, it calls the draft\_reservation() function in /backend/services/coworking/reservation.py to handle the request.  
2. /backend/services/coworking/reservation.py: The draft\_reservation() function handles the sanity check and stores the newly drafted reservation into the database.

