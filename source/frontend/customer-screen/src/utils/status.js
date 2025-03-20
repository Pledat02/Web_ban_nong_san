export const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
        case "DELIVERED":
            return { bgStatus: "bg-green-100", textStatus: "text-green-800" };
        case "SHIPPING":
            return { bgStatus: "bg-blue-100", textStatus: "text-blue-800" };
        case "WAITING_FOR_SHIPMENT":
        case "PENDING_CONFIRMATION":
            return { bgStatus: "bg-yellow-100", textStatus: "text-yellow-800" };
        case "CANCELED":
            return { bgStatus: "bg-red-100", textStatus: "text-red-800" };
        case "RETURN_REQUESTED":
        case "RETURN_APPROVED":
        case "WAITING_FOR_PICKUP":
            return { bgStatus: "bg-purple-100", textStatus: "text-purple-800" };
        case "RETURNED":
            return { bgStatus: "bg-gray-100", textStatus: "text-gray-800" };
        default:
            return { bgStatus: "bg-gray-200", textStatus: "text-gray-900" };
    }
};
