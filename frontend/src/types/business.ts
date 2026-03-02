export type Business = {
  id: string;
  name: string;
  email: string;
};

export type Booking = {
  id: string;
  businessId: string;
  clientId: string;
  scheduledAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  business: Business;
};
