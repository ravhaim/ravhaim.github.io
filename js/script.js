/**
 * ravhaim.org
 */

//ENDPOINT = {
//    '5770': 'https://lb9911.hubic.ovh.net/v1/AUTH_923194f1089bca170b98dbeeca4ae2be/default/',
//    '5771': 'https://lb9911.hubic.ovh.net/v1/AUTH_923194f1089bca170b98dbeeca4ae2be/default/',
//    '5772': 'https://lb9911.hubic.ovh.net/v1/AUTH_48a68cffb3e5258a4268ea702ab42b18/default/',
//    '5773': 'https://lb9911.hubic.ovh.net/v1/AUTH_c930b49cf0afa0c6869e1868d307ace7/default/5773/',
//    '5774': 'https://lb9911.hubic.ovh.net/v1/AUTH_c930b49cf0afa0c6869e1868d307ace7/default/5774/',
//    '5775': 'https://lb9911.hubic.ovh.net/v1/AUTH_c930b49cf0afa0c6869e1868d307ace7/default/5775/',
//    '5776': 'https://lb9911.hubic.ovh.net/v1/AUTH_c02d7149cabc2666cba7301de18b6d8b/default/',
//    '5777': 'https://lb9911.hubic.ovh.net/v1/AUTH_c02d7149cabc2666cba7301de18b6d8b/default/',
//    '5778': 'https://lb9911.hubic.ovh.net/v1/AUTH_c02d7149cabc2666cba7301de18b6d8b/default/',
//    '5779': 'https://lb9911.hubic.ovh.net/v1/AUTH_c930b49cf0afa0c6869e1868d307ace7/default/5779/'
//}

function get_url( from ) {
    media_name = from.attr('data-site-name')
    return 'https://t2s2.c13.e2-2.dev/ravhaim/' + media_name
    //shana = media_name. substr( 0, 4 )
    //return ENDPOINT[ shana ] + media_name
}

$( document ). ready( function() {

    // On-demand player
    if( $( '#site-player-od' ).length ) {
        var tmp0 = {
            //name:       'http://media.ravhaim.org/tkpnuz/' + $( '#site-player-od' ). attr( 'data-site-name' ),
            name:       get_url( $( '#site-player-od' )),
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
        //$. fileDownload( 'http://media.ravhaim.org/tkpnuz/' + $( this ). attr( 'data-site-name' ) + '.' + $( this ). attr( 'data-site-ext' ) + '?response-content-disposition=attachment&response-content-type=application/octet-stream' )
        $( this ). attr( 'href', get_url( $( this )) + '.' + $( this ). attr( 'data-site-ext' ))
        $( this ). attr( 'download', '' )
        $( this ). attr( 'type', 'application/octet-string' )
        //return false
	})
    
    var api_endpoint = 'http://api.ravhaim.org?action=?'

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

    // Subscribe/Unsubscribe
    if( /(?:un)?subscribe/.test( document.location.href ))
        if( /\?[a-z0-9]+$/.test( document.location.href )) {
            request = {}, request[ action = document.location.pathname.split('/').pop().split('.')[0] ] = document.location.href.split('?').pop()
            $( '.site-' + action + '-feedback' ). hide()
            $.getJSON( api_endpoint, request )
            .done( function( response ) {
                $( '#site-' + action + '-finish' ). modal( 'show' )
                if( 'success' == response.result ) $( '.site-' + action + '-success' ). show()
                else $( '.site-' + action + '-unknown' ). show()
            })
            .fail( function( response ) {
                $( '#site-' + action + '-finish' ). modal( 'show' )
                $( '.site-' + action + '-fail' ). show()
                $( '#site-' + action + '-finish' ). on( 'hide.bs.modal', function() { document.location = '/' })
            })
        } else
            document.location = '/'

    // Contact
    IFTTT = 'https://maker.ifttt.com/trigger/contact/json/with/key/hvycRQXMITdw9IuUv4k-9x1erlSEUeTVDYkV7peodTn'
    $( '#site-contact-submit' ). click( function() {
            $( '.site-contact-feedback' ). hide()
            info = $( '#site-contact-message' ). get( 0 ).value
            if( '' == info ) {
                $( '#site-contact-finish' ). modal( 'show' )
                $( '.site-contact-empty' ). show()
                return false
            }
            $( this ). button( 'loading' )
        $.post(IFTTT, { contact: info })
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
    


    
 