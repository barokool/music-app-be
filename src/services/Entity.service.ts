import { Model } from "mongoose";

class EntityService<Entity> {
  private entityModel: Model<Entity>;
  // create method crud for entity with the type of Entity
  public async create(dto: Entity) {
    const entity = await this.entityModel.create(dto);
    return entity;
  }
}

export { EntityService };
