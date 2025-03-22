export const getStatusColor = (status) => {
    const statusColors = {
        PENDING_CONFIRMATION: {
            bgStatus: 'bg-yellow-100',
            textStatus: 'text-yellow-800'
        },
        WAITING_FOR_SHIPMENT: {
            bgStatus: 'bg-blue-100',
            textStatus: 'text-blue-800'
        },
        SHIPPING: {
            bgStatus: 'bg-purple-100',
            textStatus: 'text-purple-800'
        },
        DELIVERED: {
            bgStatus: 'bg-green-100',
            textStatus: 'text-green-800'
        },
        CANCELED: {
            bgStatus: 'bg-red-100',
            textStatus: 'text-red-800'
        },
        RETURN_REQUESTED: {
            bgStatus: 'bg-orange-100',
            textStatus: 'text-orange-800'
        },
        RETURN_APPROVED: {
            bgStatus: 'bg-indigo-100',
            textStatus: 'text-indigo-800'
        },
        WAITING_FOR_PICKUP: {
            bgStatus: 'bg-cyan-100',
            textStatus: 'text-cyan-800'
        },
        RETURNED: {
            bgStatus: 'bg-gray-100',
            textStatus: 'text-gray-800'
        }
    };

    return statusColors[status] || { bgStatus: 'bg-gray-100', textStatus: 'text-gray-600' };
};

export const canCancelOrder = (status) => {
    return ['PENDING_CONFIRMATION', 'WAITING_FOR_SHIPMENT'].includes(status);
};

export const canReturnOrder = (status) => {
    return status === 'DELIVERED';
};

export const getStatusLabel = (status) => {
    const statusLabels = {
        PENDING_CONFIRMATION: 'Đang chờ xác nhận',
        WAITING_FOR_SHIPMENT: 'Chờ giao hàng',
        SHIPPING: 'Đang giao hàng',
        DELIVERED: 'Giao hàng thành công',
        CANCELED: 'Đơn hàng bị hủy',
        RETURN_REQUESTED: 'Đang yêu cầu trả hàng',
        RETURN_APPROVED: 'Yêu cầu trả hàng đã được duyệt',
        WAITING_FOR_PICKUP: 'Chờ nhân viên tới lấy hàng',
        RETURNED: 'Trả hàng'
    };

    return statusLabels[status] || status;
};