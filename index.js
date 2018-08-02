var snakeEmblem = $('.snake-emblem');
var scrollBtn = $('#scrollButton');
var welcome = $('#welcome');

$(window).load(function() {
    // initial animations on window load
    function initialAnimations() {
        snakeEmblem.removeClass('to-animate');
        setTimeout(function() {
            snakeEmblem.removeClass('no-border-offset');
            scrollBtn.removeClass('to-animate');
        }, 1000);
    }

    initialAnimations();
});

$(function() {
    // changing the section
    function changeSection() {
        welcome.toggleClass('away');
        toggleBtn();
    }

    // toggles the button from bot to top position and rotation
    function toggleBtn() {
        scrollBtn.toggleClass('pointing-up');
    }

    // snake on welcome page eats the dot
    function welcomeSnakeEat() {
        snakeEmblem.addClass('dot-eaten');
    }

    // game engine
    var DOMSnake = $('#game .snake-wrapper');
    var DOMDot = $('#game .dot');

    var snake = [
        {
            x: 0,
            y: gameDimension / 2,
        },
    ];
    var direction = 'RIGHT';
    var dot = {
        x: 0,
        y: 0,
    };
    var currentScore = 0;
    var highestScore = 0;
    var startDate = new Date();
    var timeInterval;
    var gameRunning = false;
    var interval;
    var snakeHead = snake[snake.length - 1];
    var speed = 100;
    var gameDimension = 480;
    var snakeSize = 20;
    var changeDirectionPossible = true;

    // converts a number of seconds to the format m:ss
    function convertSecToMinSec(sec) {
        var min = Math.floor(sec / 60);

        var restSec = sec % 60;
        if (restSec < 10) {
            restSec = '0' + restSec;
        }

        return min + ':' + restSec;
    }

    // sets the speed of the game
    function setSpeed(newSpeed) {
        speed = newSpeed;
    }

    // starts a new game
    function startNewGame() {
        resetGame();

        // gets the initial dot coordinates
        dot = generateDot();

        // sets the initial DOMSnake-parts
        snake.forEach(function(el, index, array) {
            addDOMSnakePart();
        });

        // starts the game
        gameRunning = true;

        // sets the time interval running
        timeInterval = setInterval(function() {
            $('.score .time').text(convertSecToMinSec(Math.floor((new Date() - startDate) / 1000)) + '');
        }, 100);

        // sets the drawing interval running with the given speed
        interval = setInterval(function() {
            moveSnake(direction);
        }, speed);
    }

    // resets the snake to the initial values
    function resetGame() {
        snake = [
            {
                x: 0,
                y: gameDimension / 2,
            },
        ];

        DOMSnake.empty();
        snakeHead = snake[snake.length - 1];
        currentScore = 0;
        $('#game .score-value').text(currentScore);

        startDate = new Date();

        direction = 'RIGHT';
    }

    function addDOMSnakePart() {
        DOMSnake.append('<div class="snake-part"></div>');
    }

    // increases the score by 1 and prints it to the DOM
    function increaseScore() {
        currentScore = currentScore + 1 / (speed / 100);
        $('#game .score-value').text(currentScore);
    }

    // returns random dot coordinates
    function generateDot() {
        var newDot = {};
        newDot.x = snakeHead.x;
        newDot.y = snakeHead.y;

        // generates a new dot while the dot is in snake coords
        while (
            snake.filter(function(e) {
                return newDot.x === e.x && newDot.y === e.y;
            }).length !== 0
        ) {
            newDot.x = Math.floor(Math.random() * ((240 - snakeSize) / 10)) * 20;
            newDot.y = Math.floor(Math.random() * ((240 - snakeSize) / 10)) * 20;
        }

        return newDot;
    }

    // eats a dot, generates a new one and makes the snake longer
    function eatDot() {
        increaseScore();
        DOMDot.css({ opacity: 0 });
        appendSnakePart();
        setTimeout(function() {
            dot = generateDot();
            DOMDot.animate({ opacity: 1 }, 300, 'swing');
        }, speed);
    }

    // returns true, if the coords are not taken by the snake itself or outside the game-box
    function checkCoordsValid(x, y) {
        return (
            snake.filter(function(e) {
                return e.x === x && e.y === y;
            }).length < 1
        );
    }

    // adds a new snake part to the snake
    function appendSnakePart() {
        addDOMSnakePart();
        snake.unshift({
            x: -20,
            y: -40,
        });
    }

    // sets the snake in movement
    function moveSnake(direction) {
        // if the first (last in array) snake part has the same coords as the dot, eats it.
        if (snakeHead.x === dot.x && snakeHead.y === dot.y) {
            eatDot();
        }

        switch (direction) {
            case 'TOP': {
                // checks if out of game box
                if (snake[snake.length - 1].y <= 0) {
                    gameOver();
                    break;
                }
                // checks if snake is on the current location
                else if (
                    !checkCoordsValid(snake[snake.length - 1].x, snake[snake.length - 1].y - snakeSize)
                ) {
                    gameOver();
                    break;
                } else {
                    snake.forEach(function(el, index, array) {
                        if (index + 1 < array.length) {
                            el.x = array[index + 1].x;
                            el.y = array[index + 1].y;
                        } else {
                            el.y = el.y - snakeSize;
                        }
                    });
                    drawGame();
                    break;
                }
            }

            case 'RIGHT': {
                if (snake[snake.length - 1].x >= gameDimension - snakeSize) {
                    gameOver();
                    break;
                }
                // checks if snake is on the current location
                else if (
                    !checkCoordsValid(snake[snake.length - 1].x + snakeSize, snake[snake.length - 1].y)
                ) {
                    gameOver();
                    break;
                } else {
                    snake.forEach(function(el, index, array) {
                        if (index + 1 < array.length) {
                            el.x = array[index + 1].x;
                            el.y = array[index + 1].y;
                        } else {
                            el.x = el.x + snakeSize;
                        }
                    });
                    drawGame();
                    break;
                }
            }

            case 'BOT': {
                if (snake[snake.length - 1].y >= gameDimension - snakeSize) {
                    gameOver();
                    break;
                }
                // checks if snake is on the current location
                else if (
                    !checkCoordsValid(snake[snake.length - 1].x, snake[snake.length - 1].y + snakeSize)
                ) {
                    gameOver();
                    break;
                } else {
                    snake.forEach(function(el, index, array) {
                        if (index + 1 < array.length) {
                            el.x = array[index + 1].x;
                            el.y = array[index + 1].y;
                        } else {
                            el.y = el.y + snakeSize;
                        }
                    });
                    drawGame();
                    break;
                }
            }

            case 'LEFT': {
                if (snake[snake.length - 1].x <= 0) {
                    gameOver();
                    break;
                }
                // checks if snake is on the current location
                else if (
                    !checkCoordsValid(snake[snake.length - 1].x - snakeSize, snake[snake.length - 1].y)
                ) {
                    gameOver();
                    break;
                } else {
                    snake.forEach(function(el, index, array) {
                        if (index + 1 < array.length) {
                            el.x = array[index + 1].x;
                            el.y = array[index + 1].y;
                        } else {
                            el.x = el.x - snakeSize;
                        }
                    });
                    drawGame();
                    break;
                }
            }
        }
    }

    function drawGame() {
        // draws all snake parts in the game-box
        snake.forEach(function(el, index, array) {
            DOMSnake.children(':nth-child(' + (index + 1) + ')').css({
                left: el.x,
                top: el.y,
            });
        });
        changeDirectionPossible = true;

        // draws the dot in the game-box
        DOMDot.css({
            left: dot.x,
            top: dot.y,
        });
    }

    // changes the direction of the snake
    function changeSnakeDirection(dir) {
        if (!changeDirectionPossible) return;

        // also checks if the entered direction is the opposite direction of the current direction
        switch (dir) {
            case 'TOP': {
                if (direction === 'BOT') {
                    return;
                } else {
                    direction = dir;
                    changeDirectionPossible = false;
                    return;
                }
            }

            case 'RIGHT': {
                if (direction === 'LEFT') {
                    return;
                } else {
                    direction = dir;
                    changeDirectionPossible = false;
                    return;
                }
            }

            case 'BOT': {
                if (direction === 'TOP') {
                    return;
                } else {
                    direction = dir;
                    changeDirectionPossible = false;
                    return;
                }
            }

            case 'LEFT': {
                if (direction === 'RIGHT') {

                } else {
                    direction = dir;
                    changeDirectionPossible = false;
                }
            }
        }
    }

    // freezes time and score, as well as the snake
    function pauseGame() {
        gameRunning = false;
    }

    // ends the game
    function gameOver() {
        clearInterval(interval);
        clearInterval(timeInterval);
        gameRunning = false;

        if (highestScore < currentScore) {
            highestScore = currentScore;
            $('#game .highest-value').text(highestScore);
        }

        // displays the game over notice after 1 sec
        setTimeout(function() {
            $('.game-box .game-over-notice').removeClass('away');
        }, 1000);
    }

    // user interaction

    // on clicking the scroll button to change the page content
    scrollBtn.click(function() {
        // performs the snakeEat before scrolling to the game
        if (!welcome.hasClass('away')) {
            // If the snake emblem dot hasn't been eaten, eat it before section change
            if (!snakeEmblem.hasClass('got-eaten')) {
                // removes the border and slides a bit down the snake Emblem, before eating the dot
                snakeEmblem.addClass('no-border-offset got-eaten');

                // snake eats the dot
                setTimeout(function() {
                    welcomeSnakeEat();
                }, 500);

                // changeing the dot after eating the dot
                setTimeout(function() {
                    changeSection();

                    //    after completely changing the section, sets the snake emblem back to the initial position
                    setTimeout(function() {
                        snakeEmblem.removeClass('no-border-offset dot-eaten');
                    }, 500);
                }, 1500);
            }
            // otherwise immediately change section
            else {
                changeSection();
            }
        }

        // scrolls directly to the welcome page
        else {
            changeSection();
        }
    });

    //    hides the instructions on button click
    $('.instructions button.go').click(function() {
        $('.instructions').addClass('away');
        setTimeout(function() {
            startNewGame();
        }, 200);
    });

    //    changes the snake direction on arrow keydowns
    $(document).keydown(function(e) {
        switch (e.which) {
            case 37: {
                changeSnakeDirection('LEFT');
                break;
            }
            case 38: {
                changeSnakeDirection('TOP');
                break;
            }
            case 39: {
                changeSnakeDirection('RIGHT');
                break;
            }
            case 40: {
                changeSnakeDirection('BOT');
                break;
            }
        }
    });

    //    starts a new game when clicking the play again button on game over notice
    $('.game-over-notice button.play').click(function() {
        $('.game-over-notice').addClass('away');
        setTimeout(function() {
            startNewGame();
        }, 200);
    });

    //    goes to the options screen when clicking the options button
    $('.game-over-notice button.options').click(function() {
        $('.options-screen').removeClass('away');
    });

    //    goes back to game over notice when clicking the back button on options screen
    $('.options-screen button.back').click(function() {
        $('.options-screen').addClass('away');
    });

    //    sets the difficulty when clicking on a difficulty button
    $('button.difficulty').click(function() {
        var t = $(this);
        $('button.difficulty').removeClass('active');

        // sets the speed
        if (t.hasClass('grandpa')) {
            $('button.difficulty.grandpa').addClass('active');
            setSpeed(200);
        } else if (t.hasClass('normal')) {
            $('button.difficulty.normal').addClass('active');
            setSpeed(100);
        } else if (t.hasClass('fast')) {
            $('button.difficulty.fast').addClass('active');
            setSpeed(50);
        } else if (t.hasClass('insane')) {
            $('button.difficulty.insane').addClass('active');
            setSpeed(25);
        }
    });
});
