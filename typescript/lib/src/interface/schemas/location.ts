
import * as p_i from 'pareto-core/interface/__internal/Abort'

export namespace Range_ {
    
    export type start = Location_
    
    export type end = Location_
    
}

export type Range_ = {
    readonly 'start': Range_.start
    readonly 'end': Range_.end
}

export namespace Possible_Range_ {
    
    export type range = Range_
    
    export namespace end_of_document {
        
        export type end = Location_
        
    }
    
    export type end_of_document = {
        readonly 'end': end_of_document.end
    }
    
}

export type Possible_Range_ = 
    | readonly ['range', Possible_Range_.range]
    | readonly ['end of document', Possible_Range_.end_of_document]

export namespace Location_ {
    
    export type relative = Relative_Location_
    
    export type absolute = number
    
}

export type Location_ = {
    readonly 'relative': Location_.relative
    readonly 'absolute': Location_.absolute
}

export namespace Relative_Location_ {
    
    export type line = number
    
    export type column = number
    
}

export type Relative_Location_ = {
    readonly 'line': Relative_Location_.line
    readonly 'column': Relative_Location_.column
}

export type { 
    Range_ as Range, 
    Possible_Range_ as Possible_Range, 
    Location_ as Location, 
    Relative_Location_ as Relative_Location, 
}
