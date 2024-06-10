<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDB";

// Создаем соединение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$user_id = $_POST['user_id'];
$balance = $_POST['balance'];
$wins = $_POST['wins'];
$energy = $_POST['energy'];
$rank = $_POST['rank'];

$sql = "UPDATE Users SET balance = $balance, wins = $wins, energy = $energy, rank = '$rank' WHERE user_id = $user_id";

if ($conn->query($sql) === TRUE) {
  echo "Record updated successfully";
} else {
  echo "Error updating record: " . $conn->error;
}

$conn->close();
?>