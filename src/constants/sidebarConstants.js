import {ShieldUser,ShoppingBag,LayoutGrid,SwatchBook,ContactRound,MessageCircleMore  } from 'lucide-react';

export const sidebarConstants = [
    
    {
        id:1,
        title:"Admin users",
        link:"/admin/user",
        icon:ShieldUser
    },
        {
        id:2,
        title:"Category",
        link:"/admin/category",
        icon:LayoutGrid,
    },
        {
        id:3,
        title:"Sub Category",
        link:"/admin/subcategory",
        icon:SwatchBook,
    },
    {
        id:4,
        title:"Assets",
        link:"/admin/asset",
        icon:ShoppingBag
    },
    {
        id:5,
        title:"Contacts",
        link:"/admin/contact",
        icon:ContactRound,
    },
    {
        id:6,
        title:"Enquiry Message",
        link:"/admin/enquiry",
        icon:MessageCircleMore ,
    },


]