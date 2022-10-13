import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ReviewEntity } from './review.entity';
import { MovieEntity } from '../movie/movie.entity';
import { ReviewService } from './review.service';
import { faker } from '@faker-js/faker';

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: Repository<ReviewEntity>;
  let movieRepository: Repository<MovieEntity>;
  let reviewsList: ReviewEntity[] = [];
  let movie: MovieEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReviewService],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<Repository<ReviewEntity>>(getRepositoryToken(ReviewEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    reviewRepository.clear();
    reviewsList = [];
    for (let i = 0; i < 5; i++) {
      const review: ReviewEntity = await reviewRepository.save({
        text: faker.lorem.sentence(),
        score: faker.datatype.number({ min: 0, max: 5 }),
        creator: faker.name.firstName(),
      });
      reviewsList.push(review);
    }

    movie = await movieRepository.save({
      title: faker.name.firstName(),
      poster: faker.image.imageUrl(),
      duration: faker.datatype.number(),
      country: faker.address.country(),
      releaseDate: faker.date.between('1900-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z'),
      popularity: faker.datatype.number(),
      reviews: reviewsList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all reviews from a movie', async () => {
    const reviews: ReviewEntity[] = await service.findAll(movie.id);
    expect(reviews).not.toBeNull();
    expect(reviews).toHaveLength(reviewsList.length);
  });

  it('findAll should throw an exception for an invalid movie', async () => {
    await expect(service.findAll("0")).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findOne should return a review by id', async () => {
    const storedReview: ReviewEntity = reviewsList[0];
    const review: ReviewEntity = await service.findOne(movie.id, storedReview.id);
    expect(review).not.toBeNull();
    expect(review.text).toEqual(storedReview.text);
    expect(review.score).toEqual(storedReview.score);
    expect(review.creator).toEqual(storedReview.creator);
  });

  it('findOne should throw an exception for an invalid movie', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(service.findOne("0", review.id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('findOne should throw an exception for an invalid review', async () => {
    await expect(() => service.findOne(movie.id, "0")).rejects.toHaveProperty("message", "The review with the given id was not found");
  });

  it('findOne should throw an exception for a non associated review', async () => {
    const nonAssociatedReview = await reviewRepository.save({
      text: faker.lorem.sentence(),
      score: faker.datatype.number({ min: 0, max: 5 }),
      creator: faker.name.firstName(),
    });

    await expect(() => service.findOne(movie.id, nonAssociatedReview.id)).rejects.toHaveProperty("message", "The review with the given id is not associated to the movie");
  });

  it('create should return a new review', async () => {
    const review: ReviewEntity = {
      id: "",
      text: faker.lorem.sentence(),
      score: faker.datatype.number({ min: 0, max: 5 }),
      creator: faker.name.firstName(),
      movie
    };

    const newReview: ReviewEntity = await service.create(movie.id, review);
    expect(newReview).not.toBeNull();

    const storedReview: ReviewEntity = await reviewRepository.findOne({ where: { id: newReview.id } });
    expect(storedReview).not.toBeNull();
    expect(storedReview.text).toEqual(review.text);
    expect(storedReview.score).toEqual(review.score);
    expect(storedReview.creator).toEqual(review.creator);
  });

  it('create should add review to movie', async () => {
    const review: ReviewEntity = {
      id: "",
      text: faker.lorem.sentence(),
      score: faker.datatype.number({ min: 0, max: 5 }),
      creator: faker.name.firstName(),
      movie
    };

    const newReview: ReviewEntity = await service.create(movie.id, review);
    expect(newReview).not.toBeNull();

    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id }, relations: ["reviews"] });
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.reviews).toHaveLength(reviewsList.length + 1);
  });

  it('create should throw an exception for an invalid movie', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() => service.create("0", review)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('update should modify a review', async () => {
    const review: ReviewEntity = reviewsList[0];
    review.text = faker.lorem.sentence();
    review.score = faker.datatype.number({ min: 0, max: 5 });
    review.creator = faker.name.firstName();

    const updatedReview: ReviewEntity = await service.update(movie.id, review.id, review);
    expect(updatedReview).not.toBeNull();
    const storedReview: ReviewEntity = await reviewRepository.findOne({ where: { id: review.id } });
    expect(storedReview).not.toBeNull();
    expect(storedReview.text).toEqual(review.text);
    expect(storedReview.score).toEqual(review.score);
    expect(storedReview.creator).toEqual(review.creator);
  });

  it('update should throw an exception for an invalid movie', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() => service.update("0", review.id, review)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('update should throw an exception for an invalid review', async () => {
    let review: ReviewEntity = reviewsList[0];
    review = {
      ...review,
      text: faker.lorem.sentence(),
      score: faker.datatype.number({ min: 0, max: 5 }),
      creator: faker.name.firstName(),
    };
    await expect(() => service.update(movie.id, "0", review)).rejects.toHaveProperty("message", "The review with the given id was not found");
  });

  it('update should throw an exception for a non associated review', async () => {
    const nonAssociatedReview = await reviewRepository.save({
      text: faker.lorem.sentence(),
      score: faker.datatype.number({ min: 0, max: 5 }),
      creator: faker.name.firstName(),
    });

    await expect(() => service.update(movie.id, nonAssociatedReview.id, nonAssociatedReview)).rejects.toHaveProperty("message", "The review with the given id is not associated to the movie");
  });

  it('delete should remove a review', async () => {
    const review: ReviewEntity = reviewsList[0];
    await service.delete(movie.id, review.id);
    const storedReview: ReviewEntity = await reviewRepository.findOne({ where: { id: review.id } });
    expect(storedReview).toBeNull();
  });

  it('delete should remove review from movie', async () => {
    const review: ReviewEntity = reviewsList[0];
    await service.delete(movie.id, review.id);
    const storedMovie: MovieEntity = await movieRepository.findOne({ where: { id: movie.id }, relations: ["reviews"] });
    expect(storedMovie).not.toBeNull();
    expect(storedMovie.reviews).toHaveLength(reviewsList.length - 1);
  });

  it('delete should throw an exception for an invalid movie', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() => service.delete("0", reviewsList[0].id)).rejects.toHaveProperty("message", "The movie with the given id was not found");
  });

  it('delete should throw an exception for an invalid review', async () => {
    const review: ReviewEntity = reviewsList[0];
    await expect(() => service.delete(movie.id, "0")).rejects.toHaveProperty("message", "The review with the given id was not found");
  });

});
