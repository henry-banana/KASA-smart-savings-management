import { faker } from "@faker-js/faker";

export function createMockCustomer(overrides = {}) {
  return {
    customerid: faker.number.int({ min: 1, max: 1000 }),
    fullname: faker.person.fullName(),
    citizenid: faker.string.numeric(12),
    street: faker.location.streetAddress(),
    district: faker.location.city(),
    province: "HCM",
    ...overrides,
  };
}
