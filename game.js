$(document).ready(function() {
    const $score = $('.score');
    const $highScore = $('.highScore');
    const $startScreen = $('.startScreen');
    const $gameArea = $('.gameArea');
    const $clickToStart = $('.ClickToStart');

    let keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    let player = {
        speed: 5,
        score: 0,
        highScore: 0,
        isStart: false,
        x: 0,
        y: 0
    };

    $clickToStart.on('click', startGame);
    $(document).on('keydown', function(e) {
        keys[e.key] = true;
    });
    $(document).on('keyup', function(e) {
        keys[e.key] = false;
    });

    function startGame() {
        $gameArea.empty();
        $startScreen.addClass('hide');
        player.isStart = true;
        player.score = 0;
        player.speed = 5;
        window.requestAnimationFrame(playGame);

        // Creating the road lines
        for (let i = 0; i < 5; i++) {
            const $roadLine = $('<div class="roadLines"></div>');
            $roadLine.data('y', i * 140);
            $roadLine.css('top', $roadLine.data('y') + 'px');
            $gameArea.append($roadLine);
        }

        // Creating the opponents cars
        for (let i = 0; i < 3; i++) {
            const $opponent = $('<div class="Opponents"></div>');
            $opponent.data('y', i * -300);
            $opponent.css({
                'top': $opponent.data('y') + 'px',
                'left': Math.floor(Math.random() * 350) + 'px'
            });
            $gameArea.append($opponent);
        }

        const $car = $('<div class="car"></div>');
        $gameArea.append($car);
        player.x = $car.position().left;
        player.y = $car.position().top;
    }

    function playGame() {
        const $car = $('.car');
        const road = $gameArea[0].getBoundingClientRect();
        if (player.isStart) {
            moveLines();
            moveOpponents($car);

            if (keys.ArrowUp && player.y > (road.top + 70)) {
                player.y -= player.speed;
            }
            if (keys.ArrowDown && player.y < (road.height - 75)) {
                player.y += player.speed;
            }
            if (keys.ArrowRight && player.x < 350) {
                player.x += player.speed;
            }
            if (keys.ArrowLeft && player.x > 0) {
                player.x -= player.speed;
            }

            $car.css({
                top: player.y + 'px',
                left: player.x + 'px'
            });

            $highScore.text('HighScore: ' + player.highScore);
            player.score++;
            player.speed += 0.01;

            if (player.highScore < player.score) {
                player.highScore++;
            }

            $score.text('Score: ' + player.score);

            window.requestAnimationFrame(playGame);
        }
    }

    function moveLines() {
        $('.roadLines').each(function() {
            const $this = $(this);
            if ($this.data('y') >= 700) {
                $this.data('y', $this.data('y') - 700);
            }
            $this.data('y', $this.data('y') + player.speed);
            $this.css('top', $this.data('y') + 'px');
        });
    }

    function moveOpponents($car) {
        $('.Opponents').each(function() {
            const $this = $(this);
            if (isCollide($car[0], $this[0])) {
                endGame();
            }
            if ($this.data('y') >= 750) {
                $this.data('y', $this.data('y') - 900);
                $this.css('left', Math.floor(Math.random() * 350) + 'px');
            }
            $this.data('y', $this.data('y') + player.speed);
            $this.css('top', $this.data('y') + 'px');
        });
    }

    function isCollide(a, b) {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || (aRect.right < bRect.left) || (aRect.left > bRect.right));
    }

    function endGame() {
        player.isStart = false;
        player.speed = 5;
        $startScreen.removeClass('hide');
    }
});
