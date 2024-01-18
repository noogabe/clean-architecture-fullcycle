import express, { Request, Response } from "express";
import ProductCreateUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import { InputCreateProductDto } from "../../../usecase/product/create/create.product.dto";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductPresenter from "../presenters/product.presenter";

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
  const output = await usecase.execute({});

  res.format({
    json: async () => res.send(output),
    xml: async () => res.send(ProductPresenter.listXML(output)),
  });
});