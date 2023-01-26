export interface Review {
  name: string;
  email_address: string;
  rating: number;
  comment: string;
}

export class ReviewsAPI {
  private static read(): Array<Review> {
    const json = localStorage.getItem("reviews-data");
    if (!json) return [];

    return JSON.parse(json);
  }

  private static save(reviews: Array<Review>) {
    localStorage.setItem("reviews-data", JSON.stringify(reviews));
  }

  static getAll(): Array<Review> {
    return this.read();
  }

  static add(review: Review) {
    const reviews = this.getAll();
    reviews.push(review);
    this.save(reviews);
  }
}
