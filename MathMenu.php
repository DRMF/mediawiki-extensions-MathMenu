<?php
  /*
   *Mediawiki MathMenu extension
   *
   *@file
   *@ingroup Extensions
   *@version 1.0
   *@author  Deyan Ginev and Janelle Williams
   *
   */

if (!defined('MEDIAWIKI')) {
  die("This is not a valid entry point to MediaWiki.\n");
}

//Extension credits that shows on Sepcial: Version
$wgExtensionCredits['other'][]=array(
  'path'=> __FILE__,
  'name'=> 'MathMenu',
  'author'=> 'Deyan Ginev and Janelle Williams',
  'version'=> '1.0',
  'descriptionmsg'=>'A dynamic menu for interactive services on MediaWiki formulas',
);

global $wgResourceModules, $wgOut;
$wgHooks['BeforePageDisplay'][] = 'addingModules';
function addingModules(&$out ){
  $out->addModules( array ('ext.MathMenu') );
  return true;  
}

$moduleTemplate = array(
  'localBasePath' => dirname(__FILE__) . '/',
  'remoteExtPath' => 'MathMenu/',
  'position' => 'top',
  'group' => 'ext.MathMenu',
);

$wgResourceModules['ext.MathMenu'] = $moduleTemplate + array(
  'scripts' => array(
    'jobad/js/deps/jquery/jquery-ui-1.10.3.js',
    'jobad/build/release/JOBAD.min.js',
    'math.showsource.js',
    'ZeroClipboard.js',
    'math.clipboard.js',
    "mathjax.mathjax.js",
    "wiki.formulapage.js",
    "math.wolframalpha.js",
    "JOBAD.load-global.js"
  ),
  'dependencies' =>  array('jquery','jquery.ui.core'),
  'styles' => 'jobad/build/release/JOBAD.css',
);

?>