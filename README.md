# App

Shipping Company API Clean

## FRs (Functional Requirements)

- [ ] The application must have two types of users, delivery personnel, and/or admin.;
- [ ] It should be possible to log in with a CPF (Brazilian Individual Taxpayer Registry) and password.
- [ ] CRUD operations should be available for delivery personnel.
- [ ] CRUD operations should be available for orders.
- [ ] CRUD operations should be available for recipients.
- [ ] It should be possible to mark an order as pending (available for pickup).
- [ ] It should be possible to pick up an order.
- [ ] It should be possible to mark an order as delivered.
- [ ] It should be possible to mark an order as returned.
- [ ] It should be possible to list orders with delivery addresses near the delivery personnel's location.
- [ ] It should be possible to change a user's password.
- [ ] It should be possible to list a user's deliveries.
- [ ] Recipients should be notified for each change in the order status.

## BRs (Business Rules)

- [ ] Only admin users can perform CRUD operations on orders.
- [ ] Only admin users can perform CRUD operations on delivery personnel.
- [ ] Only admin users can perform CRUD operations on recipients.
- [ ] Uploading a photo is mandatory to mark an order as delivered.
- [ ] Only the delivery personnel who picked up the order can mark it as delivered.
- [ ] Only admin users can change a user's password.
- [ ] Delivery personnel should not be able to list the orders of another delivery personnel.
