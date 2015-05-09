$(document).ready(function(){
	$(".dropdown-button").dropdown();
  $('.button-collapse').sideNav();
	$('.materialboxed').materialbox();
	$('.modal-trigger').leanModal();
    $.each($('.wavesurfer'), function(idx, item){
       var wavesurfer = Object.create(WaveSurfer);
        wavesurfer.init({
            container: item,
            waveColor: 'violet',
            progressColor: 'purple'
        });
        $(item).data('wavesurfer', wavesurfer)
        wavesurfer.load($(item).data('url'));
    })
});
