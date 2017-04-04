let A = new synaptic.Architect.Perceptron(16,25,1);

const SIZE = 4;

let trainingOptions = {
	log: true,
  rate: .1,
  iterations: 5000,
  error: .05
};

function flatten(data) {
    let result = [];
	for(let i in data) {
		result = result.concat(data[i]);
	}
	return result;
}

function gen(size) {
    let result = [];
	for(let i = 0; i < size; i++) {
		result[i] = [];
		for(let j= 0; j < size; j++) {
			result[i][j] = Math.random() > 0.5 ? 1 : 0;
		}
	}
	return result;
}

let formulaInput;

function isGood(data) {
	return eval('(function(){'+formulaInput.val()+'})();');
}

function draw(data) {
    let result = $('<div>');
	result.append(data.map(x => {
		return $('<div>').append(x.map(y => $('<div>').addClass('cell').addClass(y ? 'cell-1' : 'cell-0').html('_')));
	}));
	$('#container').append(result);
}

function lohi(a) {
	return a > 0.5;
}

function getTrainingSet() {
    let trainingSet = [];
		for(let i = 0; i < 10000; i++) {
            let d = gen(SIZE);
			trainingSet.push({
				input: flatten(d),
				output: isGood(d) ? [1] : [0]
			});
		}
	return trainingSet;
}

function daNet(input) {
	return input ? 'НС: хороший'  : 'НС: плохой';
}

$(function(){
	formulaInput = $('#formula');
	$('#formula-select').change(e => {
		formulaInput.val($('#formula-'+e.target.value).val());
	}).trigger('change');
	$('button.train').click(_ => {
		A.trainer.train(getTrainingSet(), trainingOptions);
	});
	$('button.test').click(_ => {
        let data = gen(SIZE);
		$('#container').empty();
		draw(data);
        let NNAnswer = lohi(A.activate(flatten(data)));
        let Answer = isGood(data);
        let r = $('#result');
		if(NNAnswer === Answer) {
			r.text(daNet(NNAnswer) + ' (OK)');
		} else {
			r.text(daNet(NNAnswer) + ' (FAIL)');
		}
	});
});