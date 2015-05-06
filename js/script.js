/**
 * ravhaim.org
 */

$( document ). ready( function() {

    // On-demand player
    if( $( '#site-player-od' ).length ) {
        var tmp0 = {
            name:       'http://media.ravhaim.org/' + $( '#site-player-od' ). attr( 'data-site-name' ),
            has_video:  'true' == $( '#site-player-od' ). attr( 'data-site-od-player-has-video' ),
            poster:     $( '#site-player-od-video' ). attr( 'poster' ),
            nohtml5:    'undefined' == typeof $( '#site-player-od-video' )[ 0 ],
            play:       function( ext ) {
                            if( typeof ext == 'undefined' )
                                if( tmp0. has_video && true == $( '#site-player-od-sel-video input' )[ 0 ]. checked )
                                    media_file = tmp0. name + '.mp4'
                                else media_file = tmp0. name + '.mp3'
                            else media_file = tmp0. name + ext
                            if( tmp0. nohtml5 ) swfobject.embedSWF(
                                "flash/StrobeMediaPlayback.swf",
                                "site-player-od-poster",
                                640, 360, "10.1.0",
                                "flash/expressInstall.swf",
                                {   src: media_file,
                                    controlBarMode: 'floating',
                                    poster: tmp0. poster,
                                    backgroundColor: '#ffffff',
                                    javascriptCallbackFunction: 'jsbridge'
                                },{ allowFullScreen: 'true',
                                    bgcolor: '#ffffff',
                                    wmode: 'direct'
                                },{ name: 'site-player-od-poster' }
                            )
                            else $( '#site-player-od-video' ).attr( 'src', media_file ).show().fadeTo( 'fast', 1 )[ 0 ].play()
                            $( '#site-player-od' ). attr( 'data-site-player-od-status', 'playing' )
                        },
            init:       function() {
                            if( tmp0. nohtml5 ) $.getScript( 'js/swfobject-2.2.min.js', function(){ tmp0. play() })
                            else $( '#site-player-od-play' ). click( function(){ tmp0. play() })
                            $( '#site-player-od-sel-video, #site-player-od-sel-audio' ). click( function() {
                                if( 'playing' == $( '#site-player-od' ). attr( 'data-site-player-od-status' ))
                                    tmp0. play( '.mp4' )
                            })      
                            $( '#site-player-od-sel-audio, #site-player-od-sel-audio' ). click( function() {
                                if( 'playing' == $( '#site-player-od' ). attr( 'data-site-player-od-status' ))
                                    tmp0. play( '.mp3' )
                            })      
                        }
        }
        tmp0. init()
    }
    
    // Download buttons
	$('.site-dl'). click( function() {
        $. fileDownload( 'http://media.ravhaim.org/' + $( this ). attr( 'data-site-name' ) + '.' + $( this ). attr( 'data-site-ext' ) + '?response-content-disposition=attachment&response-content-type=application/octet-stream' )
        return false
	})
    
    var api_endpoint = 'http://peaceful-caverns-2731.herokuapp.com?action=?'

    // Register
    $( '#site-register-submit' ). click( function() {
            $( '.site-register-feedback' ). hide()
            address = $( '#site-register-data' ). val()
            if( '' == address ) {
                $( '#site-register-finish' ). modal( 'show' )
                $( '.site-register-empty' ). show()
                return false
            }
            if( !/^[^\s]+\@\[?[^\s]+\.[^\s]+\]?$/.test( address )) {
                $( '#site-register-finish' ). modal( 'show' )
                $( '.site-register-problem' ). show()
                return false
            }
            $( this ). button( 'loading' )
            $.getJSON( api_endpoint, { address: address })
            .done( function( response ) {
                $( '#site-register-finish' ). modal( 'show' )
                if( 'success' == response.result ) $( '.site-register-success' ). show()
                else if( 'duplicate' == response.result ) $( '.site-register-duplicate' ). show()
                else $( '.site-register-problem' ). show()
            })
            .fail( function( response ) {
                $( '#site-register-finish' ). modal( 'show' )
                $( '.site-register-fail' ). show()
            })
            .always( function( response ) {
                $( '#site-register-submit' ). button( 'reset' )
            })
            return false
    })

    // Contact
    $( '#site-contact-submit' ). click( function() {
            $( '.site-contact-feedback' ). hide()
            info = $( '#site-contact-message' ). get( 0 ).value
            if( '' == info ) {
                $( '#site-contact-finish' ). modal( 'show' )
                $( '.site-contact-empty' ). show()
                return false
            }
            $( this ). button( 'loading' )
            $.getJSON( api_endpoint, { contact: info })
            .done( function( response ) {
                $( '#site-contact-finish' ). modal( 'show' )
                $( '.site-contact-success' ). show()
            })
            .fail( function( response ) {
                $( '#site-contact-finish' ). modal( 'show' )
                $( '.site-contact-fail' ). show()
            })
            .always( function( response ) {
                $( '#site-contact-submit' ). button( 'reset' )
            })
            return false
    })
})    
    


    
 