import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {MysqlDbDataSource} from '../datasources';
import {Post, PostRelations, Tag} from '../models';
import {Category} from '../models/category.model';
import {CategoryRepository} from './category.repository';
import {TagRepository} from './tag.repository';

const writeFile = promisify(fs.writeFile);

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  public readonly category: BelongsToAccessor<
    Category,
    typeof Post.prototype.id
  >;
  public readonly tags: HasManyRepositoryFactory<Tag, typeof Post.prototype.id>;
  constructor(
    @inject('datasources.mysqlDb') dataSource: MysqlDbDataSource,
    @repository.getter('CategoryRepository')
    protected getCategoryRepository: Getter<CategoryRepository>,
    @repository.getter('TagRepository')
    protected tagRepositoryGetter: Getter<TagRepository>,
  ) {
    super(Post, dataSource);
    this.category = this.createBelongsToAccessorFor(
      'category',
      getCategoryRepository,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);

    this.tags = this.createHasManyRepositoryFactoryFor(
      'tags',
      tagRepositoryGetter,
    );
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
  }

  async uploadFile(file: {
    buffer: Buffer;
    originalname: string;
  }): Promise<string> {
    const uploadsDir = path.resolve(__dirname, '../../public/uploads');

    // Make sure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {recursive: true});
    }

    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const fileName = `${timestamp}-${file.originalname.replace(/\s+/g, '_')}`;
    const fullPath = path.join(uploadsDir, fileName);

    await writeFile(fullPath, file.buffer);

    return fullPath;
  }
}
