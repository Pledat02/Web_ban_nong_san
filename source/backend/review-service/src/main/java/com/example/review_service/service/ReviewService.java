package com.example.review_service.service;

import com.example.review_service.dto.request.ReviewRequest;
import com.example.review_service.dto.response.ReviewResponse;
import com.example.review_service.entity.Review;
import com.example.review_service.exception.AppException;
import com.example.review_service.exception.ErrorCode;
import com.example.review_service.mapper.ReviewMapper;
import com.example.review_service.repository.ReviewRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    ReviewRepository reviewRepository;
    ReviewMapper reviewMapper;
    // TODO: Implement review CRUD operations and business logic here.
    public ReviewResponse getReviewById(long id) {
        return reviewMapper.toReviewResponse(reviewRepository.findById(id).orElse(null));
    }
    public List<ReviewResponse> getReviews(){
        return reviewRepository.findAll().stream()
                .map(reviewMapper::toReviewResponse)
                .toList();
    }
    public ReviewResponse createReview(ReviewRequest request) {
        return reviewMapper.toReviewResponse(reviewRepository.save(reviewMapper.toReview(request)));
    }
    public void updateReview(long id,ReviewRequest request) {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        reviewMapper.updateReview(id, request);
        reviewRepository.save(review);
    }
    public void deleteReview(long id){
        reviewRepository.deleteById(id);
    }
    public List<ReviewResponse> getReviewsByProductId(long productId){
        return reviewRepository.findReviewById_product(productId).stream()
                .map(reviewMapper::toReviewResponse).toList();
    }
}
