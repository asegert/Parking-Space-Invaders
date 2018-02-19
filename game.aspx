<%@ Page Language="C#" ContentType="text/html" %>


<%--/* Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018
*/--%>

<script runat="server" language="c#">

		// ********************************* START RESPONDER INITIALIZATION CODE - EXISTING RESPONDER ********************************* //

	//	AutoGrossCampaign.Campaign campaign;

	//	public int CampaignId;


	//	protected void Page_Init(Object Src, EventArgs E)
	//	{

				// Initialize campaign object to pull campaign data into the page with GetIt
	//	    if (int.TryParse(ConfigurationManager.AppSettings["CampaignId"], out CampaignId)) campaign = new AutoGrossCampaign.Campaign(CampaignId); else campaign = new AutoGrossCampaign.Campaign();


				// Bind the page
	//			Page.DataBind();
		//}
//
		// ********************************* END RESPONDER INITIALIZATION CODE - EXISTING RESPONDER ********************************* //


//protected void Page_Load(Object Src, EventArgs E)
//{

	//if (!Page.IsPostBack)
	//{
		// Save all our data in the viewstate since we may be here for a while and the session might expire
		// or the the query string might get lost

		//ViewState["S"] = Request.QueryString["S"] != null ? Request.QueryString["S"] : "";
		//ViewState["PIN"] = Request.QueryString["PIN"] != null ? Request.QueryString["PIN"] : "";
		//ViewState["Rep"] = Request.QueryString["Rep"] != null ? Request.QueryString["Rep"] : "";
		//ViewState["RecipientID"] = Session["RecipientID"] != null ? Session["RecipientID"] : "";

	//}
	//else
	//{
		// Dig up all the data and put it in the query string
		//string source = ViewState["S"] != null ? ViewState["S"].ToString() : "";
		//string pin = ViewState["PIN"] != null ? ViewState["PIN"].ToString() : "";
		//string rep = ViewState["Rep"] != null ? ViewState["Rep"].ToString() : "";
		//Session["RecipientID"] = ViewState["RecipientID"] != "" ? ViewState["RecipientID"] : null;

		// We don't want this to be vulnerable to changing, so it goes into a session variable
		//Session["Score"] = player_score.Value;

		//string URLString = "contactinfo.aspx?S=" + source + "&PIN=" + pin + "&Rep=" + rep;

	//	if (Request.QueryString["rid"] != null)
	//		URLString += "&rid=" + Request.QueryString["rid"];

	//	Response.Redirect(URLString);


	//}


//}



</script>



<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

		<meta name="robots" content="noindex" />
	<title>Parking Space Invaders | <%//#campaign.GetIt("DealerFriendlyName")%></title>
	<link rel="apple-touch-icon" sizes="57x57" href="assets/icons/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="assets/icons/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="assets/icons/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="assets/icons/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="assets/icons/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="assets/icons/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="assets/icons/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="assets/icons/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="assets/icons/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="assets/icons/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png">

        <script src="js/phaser-arcade-physics.2.5.0.min.js"></script>
	    <script src="js/states/Boot.js"></script>
	    <script src="js/states/Preload.js"></script>
	    <script src="js/states/MainMenu.js"></script>
	    <script src="js/states/Story.js"></script>
        <script src="js/states/Cache.js"></script>
	    <script src="js/states/Game.js"></script>

        <style>

        	.teko {
        	    font-family: 'Teko', sans-serif;
                font-weight: 300;
            }
            .teko-bold {
        	    font-family: 'Teko', sans-serif;
                 font-weight: 700;
            }
            .load-font {
                position: absolute;
                left:-10000px;
                top:-5000px;
            }

            html, body {
                background-color: #000;
            }

            div.modal-content{
                -webkit-box-shadow: none;
                -moz-box-shadow: none;
                -o-box-shadow: none;
                box-shadow: none;
            }
            
            #ieError{
                font-family: Arial;
                font-size: 3rem;
                text-align: center;
                margin-top:  20%;
                color: #FF0000;
            }
            #ieError a{
                font-size: 2rem;
                color:  #000000;
            }

        </style>

</head>

<body class="game">
	<h1 class="teko load-font">test</h1>
    <h1 class="teko-bold load-font">test</h1>

	<form runat='server' id="form1" name='form1' method='POST' action="">
	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content" style="background-color:transparent;">
	      <div class="modal-body" >
		    <h1 class="modal-title teko-bold text-center" style="color:#73CFFF;">CONGRATULATIONS!</h1>
	        <h2 id="firstConfirm" class="teko text-center"  style="color:#73CFFF;">You destroyed <span id="modalShips"></span> enemy ships and collected <span id="modalScore"></span> points!</h2>
	      	<h1 id="secondConfirm" class="teko text-center"  style="color:#73CFFF;">You won an Instant Win Prize worth up to</h1>
					<h1 id="secondConfirm" class="teko text-center"  style="color:#73CFFF; font-size:50px;">$1,000</h1>
	      </div>
	      <div class="modal-footer" style="background-color:transparent;border:none;">
	        <button type="submit" class="btn btn-primary btn-lg btn-block teko-bold" style="background-color:#73CFFF;color:#000;">REGISTER YOUR SCORE</input>
	      </div>
	    </div>
	  </div>
	</div>

	<!--<input type="hidden" id="player_score" value="" runat="server">-->




		</form>
	<script src="js/start.js"></script>

	<script>
		/*$(document).ready(function () {
			// on page ready launch game instructionsModal
			$('#instructionsModal').modal('show');
		});*/


	</script>
</body>
</html>
