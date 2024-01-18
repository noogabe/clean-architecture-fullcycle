import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
		const response = await request(app)
			.post("/product")
			.send({ name: "Shoes", price: 200 });

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("id");
		expect(response.body.name).toBe("Shoes");
		expect(response.body.price).toBe(200);
	});

    it("should not create a product when name is not provided", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "",
                price: 10,
            });
        expect(response.status).toBe(500);
    });

    it("should list all products", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Shoes",
                price: 200
            });

        expect(response.status).toBe(201);

        const response2 = await request(app)
            .post("/product")
            .send({
                name: "Skirt",
                price: 100
            });

        expect(response2.status).toBe(201);

        const listResponse = await request(app)
            .get("/product")
            .send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product = listResponse.body.products[0];
        expect(product.name).toBe("Shoes");
        expect(product.price).toBe(200);
        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("Skirt");
        expect(product2.price).toBe(100);

        const listResponseXML = await request(app)
            .get("/product")
            .set("Accept", "application/xml")
            .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<products>`);
        expect(listResponseXML.text).toContain(`<product>`);
        expect(listResponseXML.text).toContain(`<name>Shoes</name>`);
        expect(listResponseXML.text).toContain(`<price>200</price>`);
        expect(listResponseXML.text).toContain(`<product>`);
        expect(listResponseXML.text).toContain(`<name>Skirt</name>`);
        expect(listResponseXML.text).toContain(`<price>100</price>`);
        expect(listResponseXML.text).toContain(`</products>`);
    });
});