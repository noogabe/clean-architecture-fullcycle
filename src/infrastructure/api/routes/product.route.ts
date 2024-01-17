import express, { Request, Response } from "express";
import ProductCreateUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import { InputCreateProductDto } from "../../../usecase/product/create/create.product.dto";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
	const usecase = new ProductCreateUseCase(new ProductRepository);

	try {
		const { name, price } = req.body;

		const productDto: InputCreateProductDto = {
			name,
			price
		};

		const output = await usecase.execute(productDto);

		res.status(201).send(output);
	} catch (error) {
		res.status(500).send(error);
	}
});

productRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());
  try {
    const output = await usecase.execute({});
    res.status(200).send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});