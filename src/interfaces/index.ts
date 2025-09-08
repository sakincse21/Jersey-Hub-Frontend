export const IRole = {
    ADMIN: 'ADMIN',
    USER: 'USER'
} as const;

export const IStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED'
} as const;

export const IOrderStatus = {
    PENDING:"PENDING",
    CONFIRMED:"CONFIRMED",
    SHIPPED:"SHIPPED",
    DELIVERED:"DELIVERED",
    REFUNDED:'REFUNDED',
    CANCELLED:"CANCELLED"
} as const;

export const IPaymentMethod = {
    BKASH:'BKASH',
    COD:'COD'
} as const;

export const IPaymentStatus = {
    PAID: 'PAID',
    UNPAID: 'UNPAID'
} as const;

export const IOrderSort = {
    ASC:"asc",
    DESC:"desc"
} as const;