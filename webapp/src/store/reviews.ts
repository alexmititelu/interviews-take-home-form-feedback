export interface Review {
  created_at: string;
  name: string;
  email_address: string;
  rating: number;
  comment: string;
}

export class ReviewsAPI {
  private static read(): Array<Review> {
    const json = localStorage.getItem("reviews-data");
    if (!json) return [];

    try {
      return JSON.parse(json);
    } catch (error) {
      // Malformed JSONs
      console.log(error);
      return [];
    }
  }

  private static save(reviews: Array<Review>) {
    localStorage.setItem("reviews-data", JSON.stringify(reviews));
  }

  static getAll(): Array<Review> {
    return this.read();
  }

  static add(reviewData: Omit<Review, "created_at">) {
    const reviews = this.getAll();

    const newReview: Review = {
      ...reviewData,
      created_at: new Date().toISOString(),
    };

    reviews.push(newReview);
    this.save(reviews);
  }
}
