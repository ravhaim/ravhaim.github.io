
var plive = {
    SOURCE: 'http://media.ravhaim.org/live/live.m3u8',
    //STATE:  'http://media.ravhaim.org/live/live.json',
    STATE:  'http://api.ravhaim.org/live.txt',
    CHANNEL: '/status',
    ENDP:    'http://status-ravhaim.rhcloud.com/status',

    dim:    { w: 640, h: 360 },
    cache:  '',
    client: {},

    // init()
    init: function() {
        if( $( '#site-player-live-outer' ). length ) {
            $.getJSON( plive.STATE )
                .done( plive.live_switch2 )
            
            plive. client = new Faye.Client( plive. ENDP )
            plive. client. subscribe( plive. CHANNEL, function( message ) {
                plive.live_switch2( message )
            })
        }
    },

    live_switch2: function( response ) {
        if( 'string' == typeof response ) var r = JSON.parse( response )
        else var r = response
        console.log( r )
        switch( r. c ) {
            case 1:
                plive.show_video()
                break
            case 2:
                plive.show_splash( 'מיד נתחיל בשידור הישיר של השיעור, אנא המתינו כאן<br>&nbsp;' )
                break
            case 3:
                plive.show_splash( 'אנא עקבו כאן אחר עדכונים לגבי מועד השיעור הבא.<br>לפרטים נוספים אנא עיינו בדף&nbsp;<a class="btn-primary" href="about.html"><u>אודות השיעורים</u></a>.<br>&nbsp;' )
                break
            case 4:
                plive.show_splash(
                    'השיעור הבא יימסר מהרב שליט"א בע"ה ב' +
                    r.w + ', ' +
                    r.yh + ' ' +
                    r.hh + ' ' +
                    r.sh + ', אחר תפילת המנחה (תחילת התפילה בשעה ' +
                    r.t + ':' + r.m +
                    ')<br>לפרטים נוספים אנא עיינו בדף&nbsp;<a class="btn-primary" href="about.html"><u>אודות השיעורים</u></a>.<br>&nbsp;' )
                break
            case 5:
                plive.show_splash( r. t + '<br>&nbsp;' )
        }
    },
    show_splash: function( msg ) {
        $( '#site-player-live-outer' ).html( '<div id="site-player-live-outer"><h5 class="text-center bg-primary"><br>' + msg + '</h5></div>' )
    },

    // show_video()
    show_video: function() {
        $( '#site-player-live-outer' ).html( '<div id="site-player-live-outer"><div id="site-player-live"></div></div>' )
        plive.dim = { w: 640, h: 360 }
        ww = $( window ).width()
        if( 390 > ww ) plive.dim = { w: 270, h: 150 }
        else if( 515 > ww ) plive.dim = { w: 360, h: 200 }
        else if( 675 > ww ) plive.dim = { w: 480, h: 270 }
        if( navigator.userAgent.match(/iP(?:hone|od|ad)/i)) plive.video_tag()
        else $.getScript( 'js/swfobject-2.2.min.js', function() { 
            if( swfobject.getFlashPlayerVersion().major ) plive.video_flash()
            else if( document.getElementById( 'site-player-live' ).canPlayType( 'application/x-mpegURL' )) plive.video_tag()
            else plive.video_tag()
        })
    },

    // video_tag()
    video_tag: function() {
        $( '#site-player-live-outer' ). html( '<div id="site-player-live-outer"><video id="site-player-live" src="' + plive.SOURCE + '" controls autoPlay type="application/x-mpegURL" width="' + plive.dim.w + '" height="' + plive.dim.h + '" onended="plive.play();"></video></div>' )
    },

    // video_flash()
    video_flash: function() {
        swfobject.embedSWF(
            'flash/StrobeMediaPlayback.swf',
            'site-player-live',
            plive.dim.w, plive.dim.h,
            '10.1.0',
            'flash/expressInstall.swf', {
                src: plive.SOURCE,
                autoPlay: true,
                verbose: true,
                //controlBarMode: 'none',
                controlBarAutoHide: true,
                controlBarPosition: 'bottom',
                backgroundColor: '#428BCA', 
                tintColor: '#181818',
                //javascriptCallbackFunction: 'jsbridge',
                plugin_hls: 'flash/flashlsOSMF.swf',
                hls_minbufferlength: -1,
                hls_maxbufferlength: 30,
                hls_lowbufferlength: 3,
                hls_seekmode: 'SEGMENT_SEEK',
                hls_startfromlevel: -1,
                hls_seekfromlevel: -1,
                hls_live_flushurlcache: false,
                hls_info: true,
                hls_debug: false,
                hls_debug2: false,
                hls_warn: true,
                hls_error: true,
                hls_fragmentloadmaxretry : -1,
                hls_manifestloadmaxretry : -1,
                hls_capleveltostage : false,
                hls_maxlevelcappingmode : 'downscale' },
            {   allowFullScreen: true,
                bgcolor: '#428BCA' },
            {   name: 'site-player-live' })
    }
}

$( document ). ready( function() {
    plive.init()
})

//function jsbridge( playerId, event, data ) {
//    if( 'complete' == event ) document.getElementById( 'site-player-live' ).play2()
//}
