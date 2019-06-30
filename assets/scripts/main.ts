const {ccclass, property} = cc._decorator;
const POS = cc.Enum({
    TOP: 300,
    BOTTOM: -500
});

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab) public turtle: cc.Prefab = null;
    @property(cc.Node) public turtleManager: cc.Node = null;
    @property({type: cc.AudioClip}) public bgm: cc.AudioClip = null;
    // 指向当前使用乌龟
    public nowTurtle: cc.Node = null;

    start () {
        cc.audioEngine.playMusic(this.bgm, true);
        this.nowTurtle = this.newTurtle();
    }

    private newTurtle (): cc.Node {
        this.node.on(cc.Node.EventType.TOUCH_END, this.downTurtle, this);
        
        let t: cc.Node = cc.instantiate(this.turtle);
        t.parent = this.turtleManager;
        t.x = 0;
        t.y = POS.TOP;
        let act: cc.Action = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(1, 0).easing(cc.easeIn(1.5)),
                cc.scaleTo(1, 1).easing(cc.easeOut(1.5))
                )
            );
        t.runAction(act);
        return t;
    }

    private downTurtle (): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.downTurtle, this);
        this.nowTurtle.stopAllActions();
        if (this.turtleManager.childrenCount === 1) {
            this.nowTurtle.runAction(cc.moveTo(0.5, 0, POS.BOTTOM));
            // 1秒后继续
            this.scheduleOnce(() => {
                this.nowTurtle = this.newTurtle();
            },1);
        } else {
            // 寻找最低下的乌龟
            let index = this.turtleManager.childrenCount - 2;
            let bottomNode = this.turtleManager.children[index];
            // 求出位置
            let posY = bottomNode.y + bottomNode.height * bottomNode.scaleY;
            this.nowTurtle.runAction(cc.moveTo(0.5, 0, posY));
            // 比较缩放度
            if (this.nowTurtle.scaleX > bottomNode.scaleX) {
                console.log('游戏失败');
            } else {
                // 是否成功到6
                if (this.turtleManager.childrenCount === 6) {
                    console.log('游戏成功');
                    return;
                }
                // 1秒后继续
                this.scheduleOnce(() => {
                this.nowTurtle = this.newTurtle();
                },1);
            }
        }
    }

}
