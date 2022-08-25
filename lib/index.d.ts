import { IOssRes } from './services/oss.services';
import { InputProps } from './common/entity';
export default class OssComponent {
    /**
     * deploy
     * @param inputs
     *
     */
    deploy(inputs: InputProps): Promise<IOssRes>;
}
