
/**
* Author: Vernal
* Ratings
*/
import jQuery from 'jquery';
(function ($) {
  $(function () {
    $(window).on('shown.bs.modal', function() {
      $('.modal.fade.in .rating-lg').attr('data-value', 0);
      $('.modal.fade.in .rating-lg').raty({
        score: $(this).attr('data-value'),
        starOff: 'fa fa-star-o text-muted',
        starOn: 'fa fa-star text-warning',
        click: function(score, evt) {
          $(this).attr('data-value', score);
          $(".rate-validation").remove();
        }
      });
    });
  });
})(jQuery);