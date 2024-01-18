import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import ProductValidatorFactory from "../factory/product.validator.factory";
import ProductInterface from "./product.interface";

export default class Product extends Entity implements ProductInterface {
    _id: string;
    _name: string
    _price: number;

    constructor(id: string, name: string, price: number) {
        super();
        this._id = id;
        this._name = name;
        this._price = price;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    changeName(name: string): void {
        this._name = name;
        this.validate();
    }

    changePrice(price: number): void {
        this._price = price;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    validate() {
        ProductValidatorFactory
            .create()
            .validate(this);
    }
}