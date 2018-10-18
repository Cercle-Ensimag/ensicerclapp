<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST))
    $_POST = json_decode(file_get_contents('php://input'), true);

if (isset($_GET['action']) && $_GET['action']=='fetch_ade' && !empty($_POST['username']) && !empty($_POST['password'])){
	if (check_login($_POST['username']) || check_pswd($_POST['password'])){
		exit('dangerous character');
	}
  $html_content = file_get_contents("https://$_POST[username]:$_POST[password]@intranet.ensimag.fr/Zenith2/Utilisateur/home?login=$_POST[username]");
  if (preg_match('/\?resources=(.*?)"/', $html_content, $match) == 0)
    exit('invalid credentials');
  echo $match[1];
}
else if (isset($_GET['action']) && $_GET['action']=='fetch_edt' && !empty($_GET['resources'])){
  $resources = $_GET['resources'];
	if (check_resources($resources)) {
		exit('invalid resources');
	}
  $year = date('Y');
  if (date('m') < 8) {
    $year = $year - 1;
  }
  $ics_content = file_get_contents("https://edt.grenoble-inp.fr/directCal/".$year."-".($year + 1)."/exterieur?resources=$resources");
  echo $ics_content;
}
else {
  echo 'invalid request';
  var_dump($_GET);
  var_dump($_POST);
}

function check_resources($resources){
  return preg_match('/^[0-9]+(,[0-9]+)*$/', $resources) == 0;
}

function check_login($username){
	return preg_match('/[a-z0-9]{5,8}/', $username) == 0;
}

function check_pswd($password){
	return preg_match('/[a-zA-Z0-9]{5,16}/', $password) == 0;
}
