import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';
import { UserEntity } from './entities/test-user.entity';
import { DeleteResult, getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { UsernameAlreadyExistException } from './exceptions/username-already-exist-exception';
import { EmailAlreadyExistException } from './exceptions/email-already-exist-exception';

@Injectable()
export class UsersService {
  // for di injection constructor override
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    /* const getByUserName = getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username });

    const byUserName = await getByUserName.getOne();
    if (byUserName) {
      const error = { username: 'UserName is already exists' };
      throw new HttpException(
        { message: 'Input data validation falied', error },
        HttpStatus.BAD_REQUEST,
      );
    }
    const getByEmail = getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    const byEmail = await getByEmail.getOne();
    if (byEmail) {
      const error = { email: 'email is already exists' };
      throw new HttpException(
        { message: 'Input data validation falied', error },
        HttpStatus.BAD_REQUEST,
      );
    } */
    const thisUser = await this.userRepository.findOne({ username: username });
    if (thisUser) {
      const error = `UserName ${username} is already exist`;
      throw new UsernameAlreadyExistException(error)
    }
    const thisEmail = await this.userRepository.findOne({ email: email });
if (thisEmail) {
      const error = "Email is already exist";
      throw new EmailAlreadyExistException(error)
    }
    // create new user
    let newUser = new UserEntity();
    newUser.email = email;
    newUser.password = password;
    newUser.username = username;
    const validate_error = await validate(newUser);
    if (validate_error.length > 0) {
      const _error = { username: 'UserInput is not valid check type' };
      throw new HttpException(
        { message: 'Input data validation failed', _error },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const userEntity = await this.userRepository.save(newUser).then((v) => v)
      return {
        id: userEntity.id,
        emaiil: userEntity.email
      };
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const tmp = await this.userRepository.findOne(id).then( v =>
      console.log(`✅`)
      )
      .catch( reason => console.log(reason));
      console.log(tmp)
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return await this.userRepository.delete({ id });
  }

  async removeEmail(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }
}
