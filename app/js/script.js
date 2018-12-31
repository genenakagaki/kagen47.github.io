
anime({
    targets: '#yagi',
    top: '300px',
    direction: 'alternate',
    duration: 300,
    easing: 'easeInExpo',
    loop: true
});

// Create project cards
var template = $('#webProjects').html();

// Create cards for web apps
var projectsHtml;

$('#webProjects').html(createProjectCards(webProjects));
$('#androidProjects').html(createProjectCards(androidProjects));
$('#iosProjects').html(createProjectCards(iosProjects));

function createProjectCards(projectJson) {
    var result = "";

    for (var i = 0; i < projectJson.length; i++) {
        var p = projectJson[i];

        // Image carousel
        var imgs = "";
        for (var j = 0; j < p.imgs.length; j++) {
            imgs += "<div><img class='img-fluid' src='./img/" + p.imgs[j] + "'></div>";
        }

        // Technologies list
        var technologies = "";
        for (var j = 0; j < p.technologies.length; j++) {
            technologies += "<li>" + p.technologies[j] + "</li>"
        }

        // Details list
        var details = "";
        for (var j = 0; j < p.details.length; j++) {
            details += "<li>" + p.details[j] + "</li>";
        }

        result += template.replace("@title", p.title)
            .replace("@subtitle", p.subtitle)
            .replace("@imgThumb", p.thumb)
            .replace("@imgs", imgs)
            .replace("@technologies", technologies)
            .replace("@buttons", p.buttons)
            .replace("@description", p.description)
            .replace("@details", details);
    }

    return result;
}


// image carousel
$('.carousel').slick({
    centerMode: true,
    centerPadding: '25%',
    dots: true,
    slidesToShow: 1,
    responsive: [{
        breakpoint: 1100,
        settings: {
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 1
        }
    },
    {
        breakpoint: 480,
        settings: {
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 1
        }
    }
    ]
});

var animations = [];

var activeCardAnime;
var activeCardImgAnime;

$(document).click(function (e) {
    // Prevent right click
    if (e.button != 0) return true;

    var $target = $(e.target);
    var $activeCard = $('.card.active');
    console.log($target);

    if (activeCardAnime !== undefined && activeCardAnime.progress > 0 && activeCardAnime.progress < 100) {
        console.log("Prevent click while animating");
        return;
    }

    if ($activeCard.length == 0) {
        console.log('No active cards');
        if ($target.hasClass('card')) {
            console.log('clicked on a card');
            $activeCard = $target;

            // Adjust size and position
            startingWidth = $activeCard.outerWidth();
            startingOffsetTop = $activeCard[0].getBoundingClientRect().top;
            $activeCard.addClass('active');
            $activeCard.css('width', startingWidth + 'px');
            $activeCard.css('left', $activeCard.offset().left + 'px');
            $activeCard.css('top', startingOffsetTop + 'px');

            // Animate card
            var windowWidth = window.innerWidth;
            var windowHeight = $(window).innerHeight();
            var width = windowWidth;
            var height = windowHeight;
            activeCardAnime = anime({
                targets: '.card.active',
                left: 0,
                top: 0,
                width: width - 2, // minus the card border
                height: height,
                duration: 300,
                easing: 'easeOutQuad',
                complete: function (anim) {
                    $activeCard.css('width', '100%');
                }
            });
            activeCardAnime.play();

            // Animate for image container
            var imageHeight = height / 2;
            if (width < imageHeight * 3 / 2) {
                // if height is too small
                imageHeight = width * 2 / 3;
            }
            activeCardImgAnime = anime({
                targets: '.card.active .card-img-top',
                height: imageHeight,
                padding: '0',
                duration: 300,
                complete: function (anim) {
                    $activeCard.find('.carousel').slick('setPosition');
                    $activeCard.find('.overlay').removeClass('hidden');
                }
            });
            activeCardImgAnime.play();

            $(document.documentElement).css('overflow-y', 'hidden');
        }
    } else {
        console.log("A card is active");
        if ($target.hasClass('close')) {
            console.log("clickd on the close button");
            activeCardAnime.update = function (anim) {
                if (anim.progress === 0) {
                    $activeCard.css('left', 'auto');
                    $activeCard.css('top', '0');
                    $activeCard.css('width', 'auto');
                    $activeCard.css('height', 'auto');

                    // carousel
                    $activeCard.find('.overlay').addClass('hidden');

                    $activeCard.removeClass('active');
                    $(document.documentElement).css('overflow-y', 'scroll');
                }
            };
            activeCardAnime.reverse();
            activeCardAnime.play();
            activeCardImgAnime.reverse();
            activeCardImgAnime.play();
        }
    }
});
