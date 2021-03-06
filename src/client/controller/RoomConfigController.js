/**
 * Room Controller
 *
 * @param {Object} $scope
 * @param {RoomRepository} RoomRepository
 */
function RoomConfigController($scope, repository)
{
    this.$scope     = $scope;
    this.repository = repository;
    this.config     = null;

    // Binding:
    this.onJoined     = this.onJoined.bind(this);
    this.toggleBonus  = this.toggleBonus.bind(this);
    this.togglePreset = this.togglePreset.bind(this);
    this.setMaxScore  = this.setMaxScore.bind(this);
    this.setVariable  = this.setVariable.bind(this);
    this.applyScope   = this.applyScope.bind(this);

    // Hydratign scope
    this.$scope.toggleBonus  = this.toggleBonus;
    this.$scope.togglePreset = this.togglePreset;
    this.$scope.setMaxScore  = this.setMaxScore;
    this.$scope.setVariable  = this.setVariable;

    this.repository.on('config:max-score', this.applyScope);
    this.repository.on('config:variable', this.applyScope);
    this.repository.on('config:bonus', this.applyScope);

    this.$scope.$parent.$watch('room', this.onJoined);
}

/**
 * On room joined
 */
RoomConfigController.prototype.onJoined = function()
{
    if (this.$scope.$parent.room) {
        this.config = this.$scope.$parent.room.config;
        this.$scope.config = this.config;
    }
};

/**
 * Toggle bonus
 *
 * @param {String} bonus
 */
RoomConfigController.prototype.toggleBonus = function(bonus)
{
    if (this.config.bonusExists(bonus)) {
        var config = this.config;

        this.repository.setConfigBonus(bonus, function (result) {
            config.setBonus(bonus, result.enabled);
        });
    } else {
        console.error('Unknown bonus: %s', bonus.type);
    }
};

/**
 * Toggle preset
 *
 * @param {String} bonus
 */
RoomConfigController.prototype.togglePreset = function(preset)
{
    if (this.config.preset === preset) {
        if (preset === this.config.getDefaultPreset()) {
            return;
        }

        return this.applyPreset(this.config.getDefaultPreset());
    }

    this.applyPreset(preset);
};

/**
 * Apply the given preset
 *
 * @param {Preset} preset
 */
RoomConfigController.prototype.applyPreset = function(preset)
{
    for (var bonus in this.config.bonuses) {
        if (this.config.bonuses[bonus] !== preset.hasBonus(bonus)) {
            this.toggleBonus(bonus);
        }
    }

    this.config.preset = preset;
};

/**
 * Set max score
 */
RoomConfigController.prototype.setMaxScore = function(maxScore)
{
    var config = this.config;

    this.repository.setConfigMaxScore(maxScore, function (result) {
        config.setMaxScore(result.maxScore);
    });
};

/**
 * Set variable
 */
RoomConfigController.prototype.setVariable = function(variable)
{
    if (this.config.variableExists(variable)) {
        var config = this.config;

        this.repository.setConfigVariable(variable, this.config.getVariable(variable), function (result) {
            config.setVariable(result.variable, result.value);
        });
    }
};

/**
 * Apply scope
 */
RoomConfigController.prototype.applyScope = CurvytronController.prototype.applyScope;
