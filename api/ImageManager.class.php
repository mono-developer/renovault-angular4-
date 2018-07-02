<?php

use google\appengine\api\cloud_storage\CloudStorageTools;

class ImageManager
{
    public static function registerRoutes($apiName)
	{
        Flight::route("GET /${apiName}/bucket_session", function() {

            $my_bucket= CloudStorageTools::getDefaultGoogleStorageBucketName();
            $options = ['gs_bucket_name' => $my_bucket];
            $upload_url = CloudStorageTools::createUploadUrl('/api/image/upload', $options);
            
            Flight::json(HttpHandler::createResponse(200, $upload_url));
        }
        );


        Flight::route("POST /${apiName}/upload", function() {

            $partyAccountId = PartyAccountManager::getSignedInPartyAccountId();

            if(isset($_FILES['uploads'])) {

                foreach($_FILES['uploads']['tmp_name'] as $key=>$tmp_name)
                {
                    
                    $file_tmp = $_FILES['uploads']['tmp_name'][$key];
                    $file_name = $_FILES['uploads']['name'][$key];
                    $file_type = $_FILES['uploads']['type'][$key];

                    $ext = pathinfo($file_name, PATHINFO_EXTENSION);

                    $array[$key]['name'] = $file_name;			

                    $random = PartyAccountManager::base64_url_encode(bin2hex(openssl_random_pseudo_bytes(10)));
                    $my_bucket = CloudStorageTools::getDefaultGoogleStorageBucketName();
                    $file_move = "gs://${my_bucket}/${partyAccountId}/${random}__${file_name}";

                    // $options = array('gs'=>array('acl'=>'public-read','Content-Type' => $_FILES['uploads']['type'][$key]));
                    $options = array('gs'=>array('Content-Type' => $_FILES['uploads']['type'][$key]));
                    $ctx = stream_context_create($options);
                    $saved = file_put_contents($file_move, file_get_contents($file_tmp), 0, $ctx);

                    $baseurl = CloudStorageTools::getPublicUrl($file_move, true);

                    $bean=R::dispense('image');
                    $bean->reference_table = $_POST['reference_table'];;
                    $bean->reference_id = $_POST['reference_id'];
                    $bean->reference_string = $_POST['reference_string'];
                    $bean->name=$file_name;
                    $bean->file_tmp = $file_tmp;
                    $bean->file_move = $file_move;
                    $bean->baseurl = $baseurl;
                    $bean->file_type = $file_type;
                    $bean->file_type_mime_icon = ImageManager::getMimeIcon($file_type);
                    R::store($bean);
                }
                Flight::json(HttpHandler::createResponse(200, $array));
                
            }
        }
        );


        Flight::route("GET /${apiName}/@reference_table/@reference_id/@reference_string", function($reference_table, $reference_id, $reference_string) {
            
            $array = array();
            // $id = PartyAccountManager::getSignedInPartyAccountId();
            $all = R::find( 'image', ' reference_table = ? and reference_id = ? and reference_string = ? ', [$reference_table, $reference_id, $reference_string] );

            // fb("$reference_table :: $reference_id :: $reference_string");
            foreach ($all as $bean) 
            {
                $array[] = CrudBeanHandler::exportBean($bean);
            }
            Flight::json(HttpHandler::createResponse(200, $array));
        }
        );

        Flight::route("GET /${apiName}/download/@id", function($id) {
            ImageManager::sendImage($id, TRUE, TRUE);
            exit();
        }
        );

        Flight::route("GET /${apiName}/embed/@id", function($id) {
            ImageManager::sendImage($id, FALSE, TRUE);
            exit();
        }
        );

        // Flight::route("GET /${apiName}/rotate/@id", function($id) {
        //     $result = ImageManager::rotateImage($id, TRUE);
        //     Flight::json(HttpHandler::createResponse(200, $result));
        // });

    }

    // doesn't work (yet)
    
    // private static function rotateImage($id, $useGoogle) 
    // {
    //     $bean = R::load('image', $id);
        
    //     if ($useGoogle)
    //     {
    //         if ($fd = fopen ($bean->file_move, "r"))
    //         {
    //             // $exif = exif_read_data($fd);
    //             // CloudStorageTools::serve($bean->file_move, $options);
    //             // return $exif;
    //         }
    //         return $bean->file_move;
    //     }
    //     else
    //     {

    //         $attachment = "";
    //         if ($sendAttachmentHeader)
    //         {
    //             $attachment = " attachment;";
    //         }

    //         ignore_user_abort(true);
    //         // set_time_limit(0); // disable the time limit for this script
            
    //         if ($fd = fopen ($bean->file_move, "r")) 
    //         {
    //             $fsize = filesize($bean->file_move);
    //             header("Content-type: ".$bean->file_type);
    //             header("Content-Disposition:${attachment} filename=\"".$bean->name."\"");
    //             header("Content-length: $fsize");
    //             header("Cache-control: private"); //use this to open files directly
    //             while(!feof($fd)) 
    //             {
    //                 $buffer = fread($fd, 2048);
    //                 echo $buffer;
    //             }
    //         }
    //         fclose ($fd);
    //     }
    // }

    private static function sendImage($id, $sendAttachmentHeader, $useGoogle) 
    {
        if (getenv('DEV_OR_DIST') == 'DEV') { 
            self::sendImageDev($id, $sendAttachmentHeader, $useGoogle);
        }
        else {

            $bean = R::load('image', $id);
            
            if ($useGoogle)
            {
                $options['content_type'] = $bean->file_type;
                if ($sendAttachmentHeader)
                {
                    $options['save_as'] = $bean->name;
                }
                CloudStorageTools::serve($bean->file_move, $options);
            }
            else
            {

                $attachment = "";
                if ($sendAttachmentHeader)
                {
                    $attachment = " attachment;";
                }

                ignore_user_abort(true);
                // set_time_limit(0); // disable the time limit for this script
                
                if ($fd = fopen ($bean->file_move, "r")) 
                {
                    $fsize = filesize($bean->file_move);
                    header("Content-type: ".$bean->file_type);
                    header("Content-Disposition:${attachment} filename=\"".$bean->name."\"");
                    header("Content-length: $fsize");
                    header("Cache-control: private"); //use this to open files directly
                    while(!feof($fd)) 
                    {
                        $buffer = fread($fd, 2048);
                        echo $buffer;
                    }
                }
                fclose ($fd);
            }
        }
    }

    private static function sendImageDev($id, $sendAttachmentHeader, $useGoogle) 
    {
        $bean = R::load('image', $id);

        $attachment = "";
        if ($sendAttachmentHeader)
        {
            $attachment = " attachment;";
        }

        ignore_user_abort(true);
        // set_time_limit(0); // disable the time limit for this script
        $localfile = 'http://localhost:8080/images/home/de%20nationale%20huispas%20partnerships%20uitgelegd.png';
        $localfilesize = 95681;
        if ($fd = fopen ($localfile, "r")) 
        {
            $fsize = $localfilesize;
            header("Content-type: image/png");
            header("Content-Disposition:${attachment} filename=\"".$bean->name."\"");
            header("Content-length: $fsize");
            header("Cache-control: private"); //use this to open files directly
            while(!feof($fd)) 
            {
                $buffer = fread($fd, 2048);
                echo $buffer;
            }
        }
        fclose ($fd);
    }

    private static $mimeMap = array(
        'application/magicpoint' => 'application_magicpoint.png',
        'application/msword' => 'application_msword.png',
        'application/ogg' => 'application_ogg.png',
        'application/pdf' => 'application_pdf.png',
        'application/pgp' => 'application_pgp.png',
        'application/pgp-encrypted' => 'application_pgp-encrypted.png',
        'application/pgp-keys' => 'application_pgp-keys.png',
        'application/postscript' => 'application_postscript.png',
        'application/qif' => 'application_qif.png',
        'application/rhythmbox-effect' => 'application_rhythmbox-effect.png',
        'application/rhythmbox-playlist' => 'application_rhythmbox-playlist.png',
        'application/rtf' => 'application_rtf.png',
        'application/smil' => 'application_smil.png',
        'application/vnd' => 'application_vnd.png',
        'application/x-abiword' => 'application_x-abiword.png',
        'application/x-applix-spreadsheet' => 'application_x-applix-spreadsheet.png',
        'application/x-applix-word' => 'application_x-applix-word.png',
        'application/x-archive' => 'application_x-archive.png',
        'application/x-arj' => 'application_x-arj.png',
        'application/x-backup' => 'application_x-backup.png',
        'application/x-bittorrent' => 'application_x-bittorrent.png',
        'application/x-blender' => 'application_x-blender.png',
        'application/x-bzip' => 'application_x-bzip.png',
        'application/x-bzip-compressed-tar' => 'application_x-bzip-compressed-tar.png',
        'application/x-cd-image' => 'application_x-cd-image.png',
        'application/x-class-file' => 'application_x-class-file.png',
        'application/x-compress' => 'application_x-compress.png',
        'application/x-compressed-tar' => 'application_x-compressed-tar.png',
        'application/x-core' => 'application_x-core.png',
        'application/x-core-file' => 'application_x-core-file.png',
        'application/x-cpio' => 'application_x-cpio.png',
        'application/x-cpio-compressed' => 'application_x-cpio-compressed.png',
        'application/x-deb' => 'application_x-deb.png',
        'application/x-desktop' => 'application_x-desktop.png',
        'application/x-dia-diagram' => 'application_x-dia-diagram.png',
        'application/x-dvi' => 'application_x-dvi.png',
        'application/x-e-theme' => 'application_x-e-theme.png',
        'application/x-executable' => 'application_x-executable.png',
        'application/x-font-afm' => 'application_x-font-afm.png',
        'application/x-font-afm' => 'application_x-font-afm.png',
        'application/x-font-bdf' => 'application_x-font-bdf.png',
        'application/x-font-linux-psf' => 'application_x-font-linux-psf.png',
        'application/x-font-pcf' => 'application_x-font-pcf.png',
        'application/x-font-sunos-news' => 'application_x-font-sunos-news.png',
        'application/x-font-ttf' => 'application_x-font-ttf.png',
        'application/x-glade' => 'application_x-glade.png',
        'application/x-gnome-app-info' => 'application_x-gnome-app-info.png',
        'application/x-gnucash' => 'application_x-gnucash.png',
        'application/x-gnumeric' => 'application_x-gnumeric.png',
        'application/x-gtktalog' => 'application_x-gtktalog.png',
        'application/x-gzip' => 'application_x-gzip.png',
        'application/x-ipod-firmware' => 'application_x-ipod-firmware.png',
        'application/x-jar' => 'application_x-jar.png',
        'application/x-java-byte-code' => 'application_x-java-byte-code.png',
        'application/x-kde-app-info' => 'application_x-kde-app-info.png',
        'application/x-killustrator' => 'application_x-killustrator.png',
        'application/x-kpresenter' => 'application_x-kpresenter.png',
        'application/x-kspread' => 'application_x-kspread.png',
        'application/x-kword' => 'application_x-kword.png',
        'application/x-lha' => 'application_x-lha.png',
        'application/x-lhz' => 'application_x-lhz.png',
        'application/x-ms-application' => 'application_x-ms-application.png',
        'application/x-object' => 'application_x-object.png',
        'application/x-object-file' => 'application_x-object-file.png',
        'application/x-perl' => 'application_x-perl.png',
        'application/x-php' => 'application_x-php.png',
        'application/x-python' => 'application_x-python.png',
        'application/x-python-bytecode' => 'application_x-python-bytecode.png',
        'application/x-python-source' => 'application_x-python-source.png',
        'application/x-qw' => 'application_x-qw.png',
        'application/x-rar' => 'application_x-rar.png',
        'application/x-reject' => 'application_x-reject.png',
        'application/x-rpm' => 'application_x-rpm.png',
        'application/x-shellscript' => 'application_x-shellscript.png',
        'application/x-shockwave-flash' => 'application_x-shockwave-flash.png',
        'application/x-smil' => 'application_x-smil.png',
        'application/x-sql' => 'application_x-sql.png',
        'application/x-stuffit' => 'application_x-stuffit.png',
        'application/x-tar' => 'application_x-tar.png',
        'application/x-tex' => 'application_x-tex.png',
        'application/zip' => 'application_zip.png',
        'audio' => 'audio.png',
        'audio/ac3' => 'audio_ac3.png',
        'audio/basic' => 'audio_basic.png',
        'audio/midi' => 'audio_midi.png',
        'audio/x-aiff' => 'audio_x-aiff.png',
        'audio/x-it' => 'audio_x-it.png',
        'audio/x-midi' => 'audio_x-midi.png',
        'audio/x-mod' => 'audio_x-mod.png',
        'audio/x-mp3' => 'audio_x-mp3.png',
        'audio/x-pn-realaudio' => 'audio_x-pn-realaudio.png',
        'audio/x-s3m' => 'audio_x-s3m.png',
        'audio/x-stm' => 'audio_x-stm.png',
        'audio/x-ulaw' => 'audio_x-ulaw.png',
        'audio/x-voc' => 'audio_x-voc.png',
        'audio/x-wav' => 'audio_x-wav.png',
        'audio/x-xi' => 'audio_x-xi.png',
        'audio/x-xm' => 'audio_x-xm.png',
        'image' => 'image.png',
        'image/bmp' => 'image_bmp.png',
        'image/gif' => 'image_gif.png',
        'image/ief' => 'image_ief.png',
        'image/jpeg' => 'image_jpeg.png',
        'image/png' => 'image_png.png',
        'image/svg' => 'image_svg.png',
        'image/svg+xml' => 'image_svg+xml.png',
        'image/tiff' => 'image_tiff.png',
        'image/x-3ds' => 'image_x-3ds.png',
        'image/x-applix-graphic' => 'image_x-applix-graphic.png',
        'image/x-cmu-raster' => 'image_x-cmu-raster.png',
        'image/x-lwo' => 'image_x-lwo.png',
        'image/x-lws' => 'image_x-lws.png',
        'image/x-portable-anymap' => 'image_x-portable-anymap.png',
        'image/x-portable-bitmap' => 'image_x-portable-bitmap.png',
        'image/x-portable-graymap' => 'image_x-portable-graymap.png',
        'image/x-portable-pixmap' => 'image_x-portable-pixmap.png',
        'image/x-psd' => 'image_x-psd.png',
        'image/x-rgb' => 'image_x-rgb.png',
        'image/x-tga' => 'image_x-tga.png',
        'image/x-xbitmap' => 'image_x-xbitmap.png',
        'image/x-xcf' => 'image_x-xcf.png',
        'image/x-xfig' => 'image_x-xfig.png',
        'image/x-xpixmap' => 'image_x-xpixmap.png',
        'image/x-xwindowdump' => 'image_x-xwindowdump.png',
        'text/css' => 'text_css.png',
        'text/html' => 'text_html.png',
        'text/plain' => 'text_plain.png',
        'text/x-authors' => 'text_x-authors.png',
        'text/x-c' => 'text_x-c.png',
        'text/x-c++' => 'text_x-c++.png',
        'text/x-c++src' => 'text_x-c++src.png',
        'text/x-c-header' => 'text_x-c-header.png',
        'text/x-chdr' => 'text_x-chdr.png',
        'text/x-copying' => 'text_x-copying.png',
        'text/x-credits' => 'text_x-credits.png',
        'text/x-csh' => 'text_x-csh.png',
        'text/x-csharp' => 'text_x-csharp.png',
        'text/x-csrc' => 'text_x-csrc.png',
        'text/x-haskell' => 'text_x-haskell.png',
        'text/x-install' => 'text_x-install.png',
        'text/x-java' => 'text_x-java.png',
        'text/x-literate-haskell' => 'text_x-literate-haskell.png',
        'text/x-lyx' => 'text_x-lyx.png',
        'text/x-makefile' => 'text_x-makefile.png',
        'text/x-patch' => 'text_x-patch.png',
        'text/x-python' => 'text_x-python.png',
        'text/x-readme' => 'text_x-readme.png',
        'text/x-scheme' => 'text_x-scheme.png',
        'text/x-sh' => 'text_x-sh.png',
        'text/x-sql' => 'text_x-sql.png',
        'text/x-tex' => 'text_x-tex.png',
        'text/x-troff-man' => 'text_x-troff-man.png',
        'text/x-vcalendar' => 'text_x-vcalendar.png',
        'text/x-vcard' => 'text_x-vcard.png',
        'text/x-zsh' => 'text_x-zsh.png',
        'text/xml' => 'text_xml.png',
        'video' => 'video.png',
        'video/mpeg' => 'video_mpeg.png',
        'video/quicktime' => 'video_quicktime.png',
        'video/x-ms-asf' => 'video_x-ms-asf.png',
        'video/x-ms-wmv' => 'video_x-ms-wmv.png',
        'video/x-msvideo' => 'video_x-msvideo.png',
        'x-directory/nfs-server' => 'x-directory_nfs-server.png',
        'x-directory/smb-server' => 'x-directory_smb-server.png',
        'x-directory/smb-share' => 'x-directory_smb-share.png',
        'x-directory/smb-workgroup' => 'x-directory_smb-workgroup.png'
    );

    private static function getMimeIcon($file_type)
    {
        if (array_key_exists($file_type, ImageManager::$mimeMap))
        {
            return ImageManager::$mimeMap[$file_type]; 
        }

        if (ImageManager::stringStartsWith($file_type, 'text'))
        {
            return ImageManager::$mimeMap['text/plain'];
        }

        if (ImageManager::stringStartsWith($file_type, 'video'))
        {
            return ImageManager::$mimeMap['video'];
        }

        if (ImageManager::stringStartsWith($file_type, 'image'))
        {
            return ImageManager::$mimeMap['image'];
        }

        if (ImageManager::stringStartsWith($file_type, 'audio'))
        {
            return ImageManager::$mimeMap['audio'];
        }

        return ImageManager::$mimeMap['application/vnd'];
    }

    private static function stringStartsWith($haystack, $needle)
    {
        $length = strlen($needle);
        return (substr($haystack, 0, $length) === $needle);
    }
}