import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { SenderRoutes } from "../modules/Vendor/vendor.routes";
import { AdminRoutes } from "../modules/ADMIN/admin.route";
import { ReceiverRoutes } from "../modules/Customer/customer.route";
import { ContactRoutes } from "../modules/Contact/contact.routes";




export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/sender",
        route: SenderRoutes
    },
    {
        path: "/parcel",
        route: ParcelRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/receiver",
        route: ReceiverRoutes
    },
    {
        path: "/contact",   
        route: ContactRoutes
    }
      

    
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

