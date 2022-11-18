module.exports = {
    adminPermissions: "access-all",
    vendorPermissions: "create:products,edit:products,get:products,delete:products,update:order-status,get:category,upload-image",
    customerPermissions: "get:products,add-to-cart,create:orders",
    orderStatus: {
        0: 'pending',
        1: 'paid',
        2: 'processing',
        3: 'delivered'
    }
}