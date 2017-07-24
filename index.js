var greybox = {};

greybox.logic =
{
    loadedImages: 0,

    nextView: function() {
            var $viewWrappers = $('.view-wrapper');
            var $activeViewWrapper = $('.view-wrapper:visible');
            var activeIndex = $viewWrappers.index($activeViewWrapper);

            greybox.logic.showView(activeIndex + 1);
    },
	
    init: function()
    {
        var process = function(view)
        {
            var $viewWrappers = $('.view-wrapper');
		    var $viewWrapper = $($viewWrappers[view]);
            $viewWrapper.show();

            var $view = $viewWrapper.find('.view');
            if ($view.hasClass('actionless'))
            {
                $('#next').show();
            }

            greybox.logic.initView($view);
            greybox.logic.initLoadingScreen();
            greybox.effects.initGlobalBlink();
		
		    if (view > 1)
		    {
			    $viewWrappers.slice(0, view - 1).each(function()
			    {
				    $(this).empty();
			    });
		    }
        };

        var view = greybox.logic.getUrlParam('view');
        if (view)
        {
			view = parseInt(view);

            if (view > 5)
            {
                $.get("./viewsFrom10.html", function(data)
                {
                    $('body').append(data);

                    if (view > 15)
                    {
                        $.get("./viewsFrom20.html", function(data)
                        {
                            $('body').append(data);

                            if (view > 25)
                            {
                                $.get("./viewsFrom30.html", function(data)
                                {
                                    $('body').append(data);

                                    if (view > 35)
                                    {
                                        $.get("./viewsFrom40.html", function(data)
                                        {
                                            $('body').append(data);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }

            setTimeout(function()
            {
                process(view);
            }, 500);
		}
		else
		{
            process(0);
        }

    },

    initView: function($view)
    {
        if ($view.hasClass('text'))
        {
            var template = '<div class="text-box"><div class="text-box-background"></div><div class="text">' + $view.data('text') + '</div></div>';
            $view.append(template);
        }
        if (!$view.hasClass('actionless'))
        {
            $('#next').hide();
            $('#next-blink').hide().stop(true, true).hide().stop(true, true);
        }
        if ($view.hasClass('video'))
        {
            var video = $view.children('video')[0];

            if (greybox.logic.isMobileDevice())
            {
                video.setAttribute('controls', true);
            }
            else
            {
                video.play();
            }
        }
        if ($view.hasClass('moderated') && $view.data('file'))
        {
            var audio = new Audio($view.data('file'));
            audio.addEventListener('ended', function() {
                $('#next').show();
            }, false);
            audio.play();
        }
		if ($view.hasClass('audio'))
		{
			if ($view.data('pause-audio'))
			{
				var audio = $('#' + $view.data('pause-audio'))[0];
				audio.currentTime = 0
				audio.pause();
			}
			if ($view.data('play-audio'))
			{
				var audio = $('#' + $view.data('play-audio'))[0];
				audio.addEventListener('timeupdate', function(){
					if (this.currentTime > this.duration - 0.25)
					{
						this.currentTime = 0
						this.play()
					}
				}, false);
				audio.play();
			}
		}

        if ($view.data('onshow'))
        {
            eval($view.data('onshow'));
        }

        greybox.effects.initBlink($view);
        greybox.effects.initActions($view);
        greybox.effects.initSlide($view);
        greybox.effects.initSwitch($view);
        greybox.effects.initScrollbars($view);
    },

    getUrlParam: function(paramName)
    {
        var params = window.location.search.substring(1).split('&');
        for (var i = 0; i < params.length; i++)
        {
            var currentParamName = params[i].split('=');
            if (currentParamName[0] === paramName)
            {
                return currentParamName[1];
            }
        }
    },

    generateUUID : function(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    },

    showNextButton: function()
    {
        var $activeView = $('.view-wrapper:visible');
        var $actions = $activeView.find('.action');

        var allClicked = true;

        $actions.each(function() {
            var $this = $(this);
            if ($this.data('clicked') === false && !$this.hasClass('optional')) {
                allClicked = false;
                return false;
            }
        });

        if (allClicked)
        {
            $('#next').show();
        }
    },

    initLoadingScreen: function()
    {
        var $images = $('img');
        var imagesCount = $images.length;
        var checkLoadedImages = null;

        var checkLoadedCallback = function()
        {
            $images.each(function()
            {
                if ((this.complete || $(this).height() > 0) && !$(this).data('loaded'))
                {
                    greybox.logic.loadedImages++;
                    $(this).data('loaded', true);
                }
            });

            if (greybox.logic.loadedImages >= imagesCount)
            {
                var $viewWrappers = $('.view-wrapper');
                var $activeViewWrapper = $('.view-wrapper:visible');
                var activeIndex = $viewWrappers.index($activeViewWrapper);

                if (activeIndex === 0)
                {
                    setTimeout(function()
                    {
                        greybox.logic.showView(1, true);
                    }, 3000);
                }

                if (checkLoadedImages)
                {
                    clearInterval(checkLoadedImages);
                }
            }
        };

        checkLoadedCallback();

        $images.on('load', function()
        {
            if (!$(this).data('loaded'))
            {
                $(this).data('loaded', true);

                greybox.logic.loadedImages++;

                checkLoadedCallback();
            }
        });

        if (imagesCount < greybox.logic.loadedImages)
        {
            checkLoadedImages = setInterval(function()
            {
                checkLoadedCallback();

            }, 2000);
        }
    },

    showView: function(index)
    {
        if (index == 5)
        {
            $.get("./viewsFrom10.html", function(data)
            {
                $('body').append(data);
            });
        }
        if (index == 15)
        {
            $.get("./viewsFrom20.html", function(data)
            {
                $('body').append(data);
            });
        }
        if (index == 25)
        {
            $.get("./viewsFrom30.html", function(data)
            {
                $('body').append(data);
            });
        }
        if (index == 35)
        {
            $.get("./viewsFrom40.html", function(data)
            {
                $('body').append(data);
            });
        }

        var $viewWrappers = $('.view-wrapper');
        var $activeViewWrapper = $('.view-wrapper:visible');
        var $activeView = $activeViewWrapper.children('.view');

        if ($activeView.hasClass('video'))
        {
            var video = $activeView.children('video')[0];
            video.pause();
            video.currentTime = 0;
        }

        var $nextViewWrapper = $($viewWrappers[index]);
        var $nextView = $nextViewWrapper.children('.view');
		
        $activeViewWrapper.fadeOut(2000, function()
        {
            $activeViewWrapper.find('.tooltip').remove();
			$activeViewWrapper.empty();
        });
        $nextViewWrapper.fadeIn(4000, function()
        {
            if ($nextView.hasClass('actionless'))
            {
                $('#next').show();
            }
        });

        greybox.logic.initView($nextView);
		
    },

    isMobileDevice: function()
    {
        return navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS/i);
    }
};

greybox.effects =
{

    initScrollbars: function($view)
    {
        $view.find('.tooltip-text').mCustomScrollbar();
    },

    initGlobalBlink: function()
    {
        var $blinkTargets = $('body > img.blink');
        $blinkTargets.each(function()
        {
            var $this = $(this);

            var $associate = null;

            if ($this.data('associate'))
            {
                $associate = $("#" + $this.data('associate'));
            }

            var interval = parseFloat($this.data('interval'));
            var life = parseFloat($this.data('life'));
            var fadeDuration = 400;

            if ($this.data('fade-duration'))
            {
                fadeDuration = parseFloat($this.data('fade-duration'));
            }

            setInterval(function()
            {
                if ($associate)
                {
                    if ($associate.is(':visible'))
                    {
                        $this.fadeIn({duration: fadeDuration}).delay(life).fadeOut({duration: fadeDuration});
                    }
                }
                else
                {
                    $this.fadeIn({duration: fadeDuration}).delay(life).fadeOut({duration: fadeDuration});
                }
            }, interval);
        });
    },

    initSwitch: function($view)
    {
        var $selfSwitchTargets = $view.find('.switch-self');
        $selfSwitchTargets.data('clicked', false);
        $selfSwitchTargets.each(function() {
            var $this = $(this);
            $this.qtip({
                content: {
                    text: $this.data('text')
                },
                position: {
                    my: 'bottom left',
                    at: 'top right',
                    adjust: {
                        screen: true
                    },
                    viewport: $(window)
                },
                show: {
                    event: 'click',
                    target: $this
                },
                hide: {
                    event: 'click',
                    target: $this
                }
            });
        });

        $selfSwitchTargets.each(function()
        {
            var $this = $(this);
            $this.on('click', function()
            {
                var clicked = $this.data('clicked');
                var image = $this.data('image-click');
                if (clicked)
                {
                    image = $this.data('image-default');
                }

                $this.data('clicked', !$this.data('clicked'));
                $this.attr('src', image);
            });
        });

        var $switchInitialTargets = $view.find('.switch-initial');
        $switchInitialTargets.each(function()
        {
            var $this = $(this);
            var $associate = $this.parent('.view-wrapper').find('*[data-associate="' + $this.attr('id') + '"]');

            $this.on('click', function()
            {
                $this.hide();
                $associate.show();
            });

            $associate.on('click', function()
            {
                $associate.hide();
                $this.show();
            });
        });
    },

    initSlide: function($view)
    {
        var $slideLeftTargets = $view.find('.slide-left');
        $slideLeftTargets.each(function()
        {
            var $this = $(this);
            var $view = $this.closest('.view');

            var animate = function()
            {
                var imageWidth = $this.width();

                $this.wrap("<div class='slide-left-wrapper'></div>");

                var $parent = $this.parent();
                $parent.height($this.height());
                $parent.css('margin-left', $this.css('margin-left'));
                $parent.css('margin-top', $this.css('margin-top'));
                if ($this.data('wrapper-width'))
                {
                    $parent.width($this.data('wrapper-width'));
                }
                else
                {
                    $parent.width(imageWidth);
                }

                var wrapperWidth = $parent.width();

                $this.css('margin-left', wrapperWidth + "px");
                $this.show();

                var interval = setInterval(function()
                {
                    if (!$view.is(':visible')) {
                        clearInterval(interval);
                    }
                    else
                    {
                        var margin = parseInt($this.css('margin-left'));
                        if (margin < -1 && margin < (imageWidth * -1))
                        {
                            $this.css('margin-left', wrapperWidth + "px");
                        }
                        else
                        {
                            $this.css('margin-left', (margin - 2) + "px");
                        }
                    }
                }, 80);
            };

            if ((this.complete || $(this).height() > 0))
            {
                animate();
            }
            else
            {
                $this.on('load', function() {
                    animate();
                });
            }
        });
    },

    initBlink: function($view)
    {
        var $blinkTargets = $view.find('.blink');
        $blinkTargets.each(function() {
            var $this = $(this);
            var $view = $this.closest('.view');

            var interval = parseFloat($this.data('interval'));
            var life = parseFloat($this.data('life'));
            var fadeDuration = 400;
            var timeout = 0;

            if ($this.data('fade-duration'))
            {
                fadeDuration = parseFloat($this.data('fade-duration'));
            }
            if ($this.data('timeout'))
            {
                timeout = parseFloat($this.data('timeout'));
            }

            setTimeout(function()
            {
                var timer = setInterval(function() {
                    if (!$view.is(':visible')) {
                        clearInterval(timer);
                    }
                    else
                    {
                        $this.fadeIn({duration: fadeDuration}).delay(life).fadeOut({duration: fadeDuration});
                    }
                }, interval);
            }, timeout);
        });
    },

    initActions: function($view)
    {
        var $actionTargets = $view.find('.action');
        $actionTargets.data('clicked', false);
        $actionTargets.on('click', function()
        {
            var $this = $(this);
            var $view = $this.closest('.view');

            $view.find('.text-box').fadeOut(500);

            if ($this.hasClass('sound'))
            {
                var audio = new Audio($this.data('file'));
                audio.addEventListener('ended', function()
                {
                    if ($this.data('sound-callback'))
                    {
                        eval($this.data('sound-callback'));
                    }
                }, false);
                audio.play();
            }

            if ($this.data('show'))
            {
                var $toShow = $($this.data('show'));
                $toShow.show();

                $toShow.each(function()
                {
                    var $show = $(this);
                    if ($show.hasClass('action') && $show.data('tooltip-id'))
                    {
                        var $tooltip = $('#' + $show.data('tooltip-id'));
                        $tooltip.fadeOut(500, function()
                        {
                            $tooltip.remove();
                        });
                        $show.removeData('tooltip-id');
                    }
                });
            }

            if ($this.data('hide'))
            {
                var $toHide = $($this.data('hide'));
                $toHide.hide();
            }

            $this.data('clicked', true);
            greybox.logic.showNextButton();



            if ($this.data('tooltip-id'))
            {
                var $tooltip = $('#' + $this.data('tooltip-id'));
                $tooltip.fadeOut(500, function()
                {
                    $tooltip.remove();
                });
                $this.removeData('tooltip-id');
            }
            else if ($this.data('tooltip-text'))
            {
                var $view = $this.closest('.view');

                var tooltipHeader = '';

                if ($this.data('tooltip-header'))
                {
                    tooltipHeader = $this.data('tooltip-header');
                }

                var tooltipClass = 'tooltip';
                if ($this.data('tooltip-alternative'))
                {
                    tooltipClass = 'tooltip alternative';
                }

                var tooltipId = 'tooltip-' + greybox.logic.generateUUID();
                var template = '<div id="' + tooltipId + '" class="' + tooltipClass + '" style="'
                        + $this.data('tooltip-style') + '"><div class="tooltip-background"></div><div class="tooltip-content"><div class="tooltip-header">'
                        + tooltipHeader + '</div><div class="tooltip-text">'
                        + $this.data('tooltip-text') + '</div></div>';
                $this.data('tooltip-id', tooltipId);
                $view.append(template);

                var $tooltip = $view.find('#' + tooltipId);
                var $tooltipText = $tooltip.find('.tooltip-text');
				$tooltipText.mCustomScrollbar();
				$tooltipText.width($tooltip.width() - 50);
				$tooltipText.height($tooltip.height() - 85);
				$tooltip.fadeIn(500);
            }
        });
    }
};
