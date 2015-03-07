$(document).ready(function(){
	$(".dropdown-button").dropdown();
  $('.button-collapse').sideNav();
	$('.materialboxed').materialbox();
	$('.modal-trigger').leanModal();
    $.each($('.wavesurfer'), function(idx, item){
       var wavesurfer = Object.create(WaveSurfer);
       console.log(item);
        wavesurfer.init({
            container: item,
            waveColor: 'violet',
            progressColor: 'purple'
        });

        wavesurfer.load($(item).data('url'));
    })
});
