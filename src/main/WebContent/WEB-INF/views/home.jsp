<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
    <title>Youtube Search Api</title>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <script src="resources/jquery-1.11.2.min.js" type="text/javascript"></script>
	<script src="resources/script.js" type="text/javascript"></script>
</head>
<body>
<label>Search Query</label>
<input id="search" type="text" /><br>
<label>Minimum Dislikes</label><input id="minDislikes" type="text" value="5"/>
<input type="button" onclick="youtube_api.doSearch()" value="Search" />
<div id="results"></div>
</body>
</html>